import React, { useState, useContext } from "react";
import { FaTrash, FaFileAlt } from "react-icons/fa";
import { ResumeContext } from "../../context/ResumeContext";
import "./UploadResume.css";

function UploadResume() {

    const [resumes, setResumes] = useState([]);

    const { setAnalysis } = useContext(ResumeContext);   // ⭐ IMPORTANT

    const handleUpload = async (event) => {

        const file = event.target.files[0];
        if (!file) return;

        const userId = localStorage.getItem("user_id");

        if (!userId) {
            alert("User not logged in. Please login again.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", userId);

        try {

            const response = await fetch("http://localhost:5000/upload_resume", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {

                alert("Resume uploaded successfully!");

                // ⭐ Save analysis globally
                if (data.analysis) {
                    setAnalysis(data.analysis);
                }

                const newResume = {
                    name: file.name,
                    size: (file.size / 1024 / 1024).toFixed(2) + " MB",
                    date: new Date().toLocaleDateString(),
                };

                setResumes([...resumes, newResume]);

            } else {

                alert(data.message || "Upload failed");

            }

        } catch (error) {

            console.error("Upload error:", error);
            alert("Something went wrong while uploading.");

        }
    };

    const deleteResume = (index) => {

        const updated = resumes.filter((_, i) => i !== index);
        setResumes(updated);

    };

    return (

        <div className="upload-container">

            <h2>Upload Resume</h2>

            <div className="upload-box">

                <label className="upload-button">

                    Browse Resume

                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleUpload}
                        hidden
                    />

                </label>

                <p>Supported format: PDF</p>

            </div>

            {resumes.length > 0 && (

                <div className="resume-list">

                    <h3>Uploaded Resume</h3>

                    {resumes.map((resume, index) => (

                        <div className="resume-item" key={index}>

                            <div className="resume-info">

                                <FaFileAlt className="file-icon" />

                                <div>

                                    <strong>{resume.name}</strong>

                                    <p>
                                        Uploaded {resume.date} • {resume.size}
                                    </p>

                                </div>

                            </div>

                            <FaTrash
                                className="delete-icon"
                                onClick={() => deleteResume(index)}
                            />

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default UploadResume;