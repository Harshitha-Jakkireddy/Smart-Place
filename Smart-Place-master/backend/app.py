from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import json
import os
import pdfplumber

# AI Libraries
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# ------------------------
# DATABASE CONFIG
# ------------------------
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# ------------------------
# PATH CONFIG
# ------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "resumes")
JOBS_FILE = os.path.join(BASE_DIR, "jobs.json")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ------------------------
# LOAD AI MODEL
# ------------------------
model = SentenceTransformer('all-MiniLM-L6-v2')

# ------------------------
# SKILL KEYWORDS
# ------------------------
SKILL_KEYWORDS = [
    # Programming
    "python","java","c++","c","javascript","typescript",
    
    # Frontend
    "react","angular","vue","html","css","bootstrap","tailwind",
    
    # Backend
    "node","node.js","express","flask","django","spring","rest api",
    
    # Database
    "mysql","postgresql","mongodb","sqlite","oracle",
    
    # Cloud & DevOps
    "aws","azure","docker","kubernetes",
    
    # AI/ML
    "machine learning","deep learning","tensorflow","pytorch","nlp",
    
    # Tools
    "git","github","linux","jira"
]

# ------------------------
# EXTRACT SKILLS
# ------------------------
def extract_skills(text):
    text = text.lower()
    return list(set(skill for skill in SKILL_KEYWORDS if skill in text))

# ------------------------
# MATCH LOGIC
# ------------------------
def compute_match(resume_skills, job_skills):

    resume_skills = [s.lower() for s in resume_skills]
    job_skills = [s.lower() for s in job_skills]

    matched_skills = list(set(resume_skills) & set(job_skills))
    missing_skills = list(set(job_skills) - set(resume_skills))

    match_percentage = round(
        (len(matched_skills) / len(job_skills)) * 100, 2
    ) if job_skills else 0

    recommendations = []
    for skill in missing_skills:
        recommendations.append(f"Improve {skill}")
        recommendations.append(f"Build project using {skill}")

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "match_percentage": match_percentage,
        "recommendations": recommendations
    }

    

# ------------------------
# USER MODEL
# ------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)

with app.app_context():
    db.create_all()

# ------------------------
# REGISTER
# ------------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.json

    if not data or not data.get("email") or not data.get("password") or not data.get("role"):
        return jsonify({"message": "All fields required"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "User already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    new_user = User(
        email=data['email'],
        password=hashed_pw,
        role=data['role']
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Registered successfully"}), 201

# ------------------------
# LOGIN
# ------------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.json

    user = User.query.filter_by(email=data["email"]).first()

    if user and bcrypt.check_password_hash(user.password, data["password"]):
        return jsonify({
            "role": user.role,
            "user_id": user.id,
            "email": user.email
        }), 200

    return jsonify({"message": "Invalid credentials"}), 401

# ------------------------
# CREATE JOB
# ------------------------
@app.route('/jobs', methods=['POST'])
def create_job():

    data = request.get_json()

    if not data or not data.get("title") or not data.get("required_skills"):
        return jsonify({"message": "Title and skills required"}), 400

    if not os.path.exists(JOBS_FILE):
        with open(JOBS_FILE, "w") as f:
            json.dump([], f)

    with open(JOBS_FILE, "r") as f:
        jobs = json.load(f)

    new_job = {
        "id": len(jobs) + 1,
        "title": data["title"],
        "description": data.get("description", ""),
        "required_skills": data["required_skills"]
    }

    jobs.append(new_job)

    with open(JOBS_FILE, "w") as f:
        json.dump(jobs, f, indent=4)

    return jsonify({"message": "Job created"}), 201

# ------------------------
# GET JOBS
# ------------------------
@app.route('/jobs', methods=['GET'])
def get_jobs():
    if not os.path.exists(JOBS_FILE):
        return jsonify([])

    with open(JOBS_FILE, "r") as f:
        jobs = json.load(f)

    return jsonify(jobs)

# ------------------------
# UPLOAD RESUME (Linked to User)
# ------------------------
@app.route('/upload_resume', methods=['POST'])
def upload_resume():

    user_id = request.form.get("user_id")

    if not user_id:
        return jsonify({"message": "User ID required"}), 400

    if 'file' not in request.files:
        return jsonify({"message": "No file"}), 400

    file = request.files['file']

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"message": "Only PDF allowed"}), 400

    filename = f"{user_id}_{file.filename}"
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(save_path)

    return jsonify({"message": "Resume uploaded"}), 200

# ------------------------
# ADMIN MATCH (ALL RESUMES)
# ------------------------
@app.route('/admin/match/<int:job_id>', methods=['GET'])
def admin_match(job_id):

    if not os.path.exists(JOBS_FILE):
        return jsonify({"results": []})

    with open(JOBS_FILE, "r") as f:
        jobs = json.load(f)

    job = next((j for j in jobs if j["id"] == job_id), None)

    if not job:
        return jsonify({"message": "Job not found"}), 404

    results = []

    for filename in os.listdir(UPLOAD_FOLDER):

        if filename.endswith(".pdf"):

            file_path = os.path.join(UPLOAD_FOLDER, filename)

            with pdfplumber.open(file_path) as pdf:
                text = ""
                for page in pdf.pages:
                    if page.extract_text():
                        text += page.extract_text()

            resume_skills = extract_skills(text)

            match_data = compute_match(resume_skills, job["required_skills"])

            results.append({
                "resume_name": filename,
                **match_data
            })

    results.sort(key=lambda x: x["match_percentage"], reverse=True)

    return jsonify({
        "job_title": job["title"],
        "results": results
    })

# ------------------------
# STUDENT MATCH (ONLY HIS RESUME)
# ------------------------
@app.route('/student/match/<int:user_id>', methods=['GET'])
def student_match(user_id):

    student_resume = None

    for filename in os.listdir(UPLOAD_FOLDER):
        if filename.startswith(f"{user_id}_"):
            student_resume = filename
            break

    if not student_resume:
        return jsonify({
            "message": "No Resume Uploaded",
            "results": []
        })

    resume_path = os.path.join(UPLOAD_FOLDER, student_resume)

    with pdfplumber.open(resume_path) as pdf:
        text = ""
        for page in pdf.pages:
            if page.extract_text():
                text += page.extract_text()

    resume_skills = extract_skills(text)

    if not os.path.exists(JOBS_FILE):
        return jsonify({"results": []})

    with open(JOBS_FILE, "r") as f:
        jobs = json.load(f)

    results = []

    for job in jobs:

        match_data = compute_match(resume_skills, job["required_skills"])

        results.append({
            "job_title": job["title"],
            "description": job["description"],
            **match_data
        })

    results.sort(key=lambda x: x["match_percentage"], reverse=True)

    return jsonify({
        "resume_name": student_resume,
        "results": results
    })

# ------------------------
# RUN
# ------------------------
if __name__ == '__main__':
    app.run(debug=True)