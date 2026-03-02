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
# SKILL DICTIONARY
# ------------------------
SKILL_KEYWORDS = [
    "python", "java", "c++", "flask", "django",
    "mysql", "postgresql", "mongodb",
    "react", "node", "javascript",
    "html", "css",
    "machine learning", "deep learning",
    "tensorflow", "pytorch"
]

# ------------------------
# SKILL EXTRACTION
# ------------------------
def extract_skills(text):
    text = text.lower()
    return list(set(skill for skill in SKILL_KEYWORDS if skill in text))

# ------------------------
# MATCHING LOGIC
# ------------------------
def compute_match(resume_name, resume_skills, job_skills):

    resume_skills = [s.lower() for s in resume_skills]
    job_skills = [s.lower() for s in job_skills]

    matched_skills = list(set(resume_skills) & set(job_skills))

    exact_ratio = len(matched_skills) / len(job_skills) if job_skills else 0
    exact_percentage = round(exact_ratio * 100, 2)

    resume_text = " ".join(resume_skills)
    job_text = " ".join(job_skills)

    resume_embedding = model.encode([resume_text])
    job_embedding = model.encode([job_text])

    cosine_sim = float(cosine_similarity(resume_embedding, job_embedding)[0][0])
    cosine_percentage = round(cosine_sim * 100, 2)

    final_score = (0.6 * cosine_sim) + (0.4 * exact_ratio)
    final_percentage = round(final_score * 100, 2)

    return {
        "resume_name": resume_name,
        "matched_skills": matched_skills,
        "cosine_similarity_percentage": cosine_percentage,
        "exact_match_percentage": exact_percentage,
        "final_score_percentage": final_percentage
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
        return jsonify({"success": False, "message": "All fields required"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"success": False, "message": "User already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    new_user = User(
        email=data['email'],
        password=hashed_pw,
        role=data['role']
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "message": "User registered successfully"}), 201

# ------------------------
# LOGIN
# ------------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.json

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"success": False, "message": "Missing credentials"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if user and bcrypt.check_password_hash(user.password, data["password"]):
        return jsonify({
            "success": True,
            "role": user.role,
            "user_id": user.id,
            "email": user.email
        }), 200

    return jsonify({"success": False, "message": "Invalid credentials"}), 401

# ------------------------
# CREATE JOB
# ------------------------
@app.route('/jobs', methods=['POST'])
def create_job():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "No data received"}), 400

        if not data.get("title") or not data.get("required_skills"):
            return jsonify({"success": False, "message": "Title and skills required"}), 400

        new_job = {
            "id": None,
            "title": data["title"],
            "description": data.get("description", ""),
            "required_skills": data["required_skills"]
        }

        if not os.path.exists(JOBS_FILE):
            with open(JOBS_FILE, "w") as f:
                json.dump([], f)

        with open(JOBS_FILE, "r") as f:
            jobs = json.load(f)

        new_job["id"] = len(jobs) + 1
        jobs.append(new_job)

        with open(JOBS_FILE, "w") as f:
            json.dump(jobs, f, indent=4)

        return jsonify({"success": True, "message": "Job created successfully"}), 201

    except Exception as e:
        print("Create job error:", e)
        return jsonify({"success": False, "message": "Job creation failed"}), 500

# ------------------------
# GET JOBS
# ------------------------
@app.route('/jobs', methods=['GET'])
def get_jobs():
    if not os.path.exists(JOBS_FILE):
        return jsonify([]), 200

    with open(JOBS_FILE, "r") as f:
        jobs = json.load(f)

    return jsonify(jobs), 200

# ------------------------
# UPLOAD RESUME
# ------------------------
@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file provided"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"success": False, "message": "No file selected"}), 400

    if not file.filename.lower().endswith(('.pdf', '.doc', '.docx')):
        return jsonify({"success": False, "message": "Invalid file format"}), 400

    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(save_path)

    return jsonify({"success": True, "message": "Resume uploaded successfully"}), 200

# ------------------------
# MATCH RESUMES
# ------------------------
@app.route('/match/<int:job_id>', methods=['GET'])
def match_resumes(job_id):

    if not os.path.exists(JOBS_FILE):
        return jsonify({"message": "No jobs found"}), 404

    with open(JOBS_FILE, "r") as f:
        jobs = json.load(f)

    job = next((j for j in jobs if j["id"] == job_id), None)

    if not job:
        return jsonify({"message": "Job not found"}), 404

    job_skills = job["required_skills"]
    results = []

    for filename in os.listdir(UPLOAD_FOLDER):
        if filename.endswith(".pdf"):
            file_path = os.path.join(UPLOAD_FOLDER, filename)

            with pdfplumber.open(file_path) as pdf:
                resume_text = ""
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        resume_text += text

            resume_skills = extract_skills(resume_text)

            result = compute_match(filename, resume_skills, job_skills)
            results.append(result)

    results.sort(key=lambda x: x["final_score_percentage"], reverse=True)

    return jsonify(results), 200

# ------------------------
# RUN
# ------------------------
if __name__ == '__main__':
    app.run(debug=True)