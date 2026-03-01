# 🚀 SmartPlace  
### AI-Based Semantic Matching Campus Placement Platform

SmartPlace is an AI-powered campus placement platform that performs **semantic resume-to-job matching** with proficiency-aware scoring.  
It helps students understand their job readiness and provides personalized improvement roadmaps, while enabling admins to rank candidates intelligently.

---

## 📌 Project Overview

Traditional campus placements rely on manual resume screening and keyword-based filtering.  
SmartPlace improves this by using:

- AI-based resume parsing
- Semantic skill matching (not keyword-only)
- Proficiency-level weighted scoring
- Skill gap analysis
- Interview preparation recommendations

This project is built as a **Full-Stack Mini Project** using:

- ⚙️ FastAPI (Backend - Python)
- 🗄️ Database (SQL)
- 🤖 AI Resume Parsing
- 🎨 Modern Frontend (React / Next.js)
- 🔐 Role-Based Authentication with Email Verification

---

# ✨ Features

---

## 🔐 Authentication & Security

- Email verification required before login
- Role-based access (Student / Admin)
- JWT-based authentication
- Protected routes
- Secure password hashing

### Assigned Roles:
- `kmegha9505@gmail.com` → Admin
- `23wh1a12c1@bvrithyderabad.edu.in` → Student

---

## 👨‍🎓 Student Features

### 📄 Resume Upload & AI Parsing
- Upload PDF / DOCX / TXT resume
- AI extracts:
  - Name
  - Email
  - Education
  - Projects
  - Certifications
  - Technical Skills
  - Soft Skills
  - Proficiency Levels (Beginner / Intermediate / Advanced)

### 🧾 Profile Management
- Edit profile details
- Manually add/update skills
- Update proficiency levels

### 💼 Job Portal
- View all job postings
- Click job → View detailed job description
- “Test My Match” feature

### 📊 Match Analysis Includes:
- Semantic match percentage
- Matched skills
- Missing skills
- Proficiency-aware scoring
- Visual breakdown of match

### 🤖 AI Recommendations:
- Skills to improve
- Proficiency upgrade path
- 4-week improvement roadmap
- Personalized interview questions
- Answer hints
- Resume improvement suggestions
- Suggested project ideas

---

## 👩‍💼 Admin Features

- Create job postings
- Edit job postings
- Delete job postings
- Define required skills with proficiency level
- View all registered students
- View ranked candidates per job
- Proficiency-weighted candidate scoring

### 📊 Admin Dashboard Analytics:
- Total students
- Total jobs
- Top matched candidates
- Skill gap trends

---

# 🧠 Matching Algorithm

SmartPlace uses **AI-based semantic matching** instead of keyword matching.

### Scoring Factors:
1. Skill similarity
2. Proficiency weight:
   - Advanced → Highest weight
   - Intermediate → Medium weight
   - Beginner → Lowest weight

### Auto-Recalculation:
Matches are recomputed when:
- Resume is updated
- Skills are edited
- A new job is posted

---

# 🏗️ Tech Stack

| Layer        | Technology |
|-------------|------------|
| Backend     | FastAPI (Python) |
| Frontend    | React / Next.js |
| Database    | SQL |
| Authentication | JWT + Email Verification |
| AI Parsing  | NLP-based Resume Extraction |
| Styling     | Modern UI (Responsive Design) |

---

# 🗂️ Project Structure

```
SmartPlace/
│
├── backend/
│   ├── main.py
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── database.py
│
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── dashboards/
│   └── styles/
│
└── README.md
```

---

# 🔄 Application Flow

### Student Flow
1. Register
2. Verify Email
3. Login
4. Upload Resume
5. View Extracted Skills
6. Browse Jobs
7. Test Match
8. View Recommendations

### Admin Flow
1. Login
2. Post Job
3. View Ranked Candidates
4. Analyze Skill Gaps

---

# 🎯 Why This Project?

✔️ Solves real campus placement inefficiencies  
✔️ Uses AI instead of keyword filtering  
✔️ Provides actionable improvement insights  
✔️ Demonstrates full-stack development skills  
✔️ Suitable for Mini Project / Final Year Project  

---

# 🚀 Future Enhancements

- Real-time AI chat assistant for students
- Resume score analysis (ATS simulation)
- Company portal access
- Skill certification integration
- Machine learning-based ranking improvements
- Deployment on cloud (AWS / Azure)

---

# 📸 Screens Included

- Landing Page
- Student Dashboard
- Admin Dashboard
- Job Detail Page
- Profile Edit Page

---

# 📜 License

This project is developed for educational and academic purposes.

---

# 👩‍💻 Developed By

SmartPlace – AI-Based Semantic Matching Platform  
Mini Project Submission – 2026
