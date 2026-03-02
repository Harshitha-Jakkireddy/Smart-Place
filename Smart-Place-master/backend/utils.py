import pdfplumber
from sklearn.metrics.pairwise import cosine_similarity
from model import get_embedding

skills_list = [
    "python",
    "java",
    "sql",
    "machine learning",
    "deep learning",
    "nlp",
    "docker",
    "react",
    "tensorflow",
    "pytorch"
]


def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text


def extract_skills_rule_based(text):
    detected_skills = []
    text = text.lower()

    for skill in skills_list:
        if skill in text:
            detected_skills.append(skill)

    return detected_skills


def calculate_similarity(resume_text, job_text):
    resume_embedding = get_embedding(resume_text)
    job_embedding = get_embedding(job_text)

    similarity = cosine_similarity(
        [resume_embedding],
        [job_embedding]
    )[0][0]

    return float(similarity * 100)