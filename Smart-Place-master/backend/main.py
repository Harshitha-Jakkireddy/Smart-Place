from fastapi import FastAPI, UploadFile, File, Form
from utils import (
    extract_text_from_pdf,
    extract_skills_rule_based,
    calculate_similarity
)

app = FastAPI()


@app.post("/match/")
async def match_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):

    # Extract resume text
    resume_text = extract_text_from_pdf(resume)

    # Extract skills (Rule-based)
    resume_skills = extract_skills_rule_based(resume_text)
    job_skills = extract_skills_rule_based(job_description)

    # Calculate similarity using AI
    match_percentage = calculate_similarity(resume_text, job_description)

    # Find missing skills
    missing_skills = list(set(job_skills) - set(resume_skills))

    return {
        "match_percentage": round(match_percentage, 2),
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "missing_skills": missing_skills
    }