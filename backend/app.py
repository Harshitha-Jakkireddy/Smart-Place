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

# ------------------------
# CORS CONFIGURATION
# ------------------------
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# ------------------------
# Load Embedding Model
# ------------------------
model = SentenceTransformer('all-MiniLM-L6-v2')

# ------------------------
# Skill Dictionary
# ------------------------
SKILL_KEYWORDS = [
    "python", "java", "c++", "flask", "django",
    "mysql", "postgresql", "mongodb",
    "react", "node", "javascript",
    "html", "css",
    "machine learning", "deep learning",
    "tensorflow", "pytorch"
]


def extract_skills(text):
    text = text.lower()
    found_skills = []

    for skill in SKILL_KEYWORDS:
        if skill in text:
            found_skills.append(skill)

    return list(set(found_skills))


# ------------------------
# Matching Logic
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

    cosine_sim = float(
        cosine_similarity(resume_embedding, job_embedding)[0][0]
    )

    cosine_percentage = round(cosine_sim * 100, 2)

    final_score = (0.6 * cosine_sim) + (0.4 * exact_ratio)
    final_percentage = round(final_score * 100, 2)

    return {
        "resume_name": resume_name,
        "resume_skills": resume_skills,
        "matched_skills": matched_skills,
        "cosine_similarity_percentage": cosine_percentage,
        "exact_match_percentage": exact_percentage,
        "final_score_percentage": final_percentage
    }


# ------------------------
# User Model
# ------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)


with app.app_context():
    db.create_all()


# ------------------------
# Register
# ------------------------
@app.route('/register', methods=['POST'])
def register():

    data = request.json

    if not data or not data.get("email") \
       or not data.get("password") \
       or not data.get("role"):
        return jsonify({"message": "All fields are required"}), 400

    existing_user = User.query.filter_by(
        email=data["email"]
    ).first()

    if existing_user:
        return jsonify({"message": "User already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(
        data['password']
    ).decode('utf-8')

    new_user = User(
        email=data['email'],
        password=hashed_pw,
        role=data['role']
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


# ------------------------
# Login
# ------------------------
@app.route('/login', methods=['POST'])
def login():

    data = request.json

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Missing credentials"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if user and bcrypt.check_password_hash(
            user.password, data["password"]):

        return jsonify({
            "message": "Login successful",
            "role": user.role,
            "user_id": user.id,
            "email": user.email
        }), 200

    return jsonify({"message": "Invalid credentials"}), 401


# ------------------------
# Create Job
# ------------------------
@app.route('/jobs', methods=['POST'])
def create_job():

    data = request.json

    if not data.get("title") or not data.get("required_skills"):
        return jsonify(
            {"message": "Missing title or required_skills"}
        ), 400

    new_job = {
        "id": None,
        "title": data['title'],
        "required_skills": data['required_skills'],
        "description": data.get("description", "")
    }

    file_path = "jobs.json"

    if not os.path.exists(file_path):
        with open(file_path, "w") as f:
            json.dump([], f)

    with open(file_path, "r") as f:
        jobs = json.load(f)

    new_job["id"] = len(jobs) + 1
    jobs.append(new_job)

    with open(file_path, "w") as f:
        json.dump(jobs, f, indent=4)

    return jsonify({"message": "Job created successfully"}), 201


# ------------------------
# Get Jobs
# ------------------------
@app.route('/jobs', methods=['GET'])
def get_jobs():

    if not os.path.exists("jobs.json"):
        return jsonify([]), 200

    with open("jobs.json", "r") as f:
        jobs = json.load(f)

    return jsonify(jobs), 200


# ------------------------
# Match Resumes
# ------------------------
@app.route('/match/<int:job_id>', methods=['GET'])
def match_resumes(job_id):

    if not os.path.exists("jobs.json"):
        return jsonify({"message": "No jobs found"}), 404

    with open("jobs.json", "r") as f:
        jobs = json.load(f)

    job = next((j for j in jobs if j["id"] == job_id), None)

    if not job:
        return jsonify({"message": "Job not found"}), 404

    job_skills = job.get("required_skills")

    if not job_skills:
        return jsonify({"message": "Job has no required_skills"}), 400

    results = []
    resumes_folder = "resumes"

    if not os.path.exists(resumes_folder):
        return jsonify(
            {"message": "Resumes folder not found"}
        ), 404

    for filename in os.listdir(resumes_folder):

        if filename.endswith(".pdf"):
            file_path = os.path.join(resumes_folder, filename)

            try:
                with pdfplumber.open(file_path) as pdf:
                    resume_text = ""

                    for page in pdf.pages:
                        text = page.extract_text()
                        if text:
                            resume_text += text + "\n"

                resume_skills = extract_skills(resume_text)

                result = compute_match(
                    filename,
                    resume_skills,
                    job_skills
                )

                results.append(result)

            except Exception as e:
                print(f"Error processing {filename}: {e}")

    results.sort(
        key=lambda x: x["final_score_percentage"],
        reverse=True
    )

    return jsonify({
        "job_title": job["title"],
        "required_skills": job_skills,
        "results": results
    }), 200


if __name__ == '__main__':
    app.run(debug=True)