import React, { useState } from "react";
import { FaTrash, FaFileAlt } from "react-icons/fa";
import "./UploadResume.css";

function UploadResume() {
    const [resumes, setResumes] = useState([]);

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5000/upload_resume", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                alert("Resume uploaded successfully!");

                const newResume = {
                    name: file.name,
                    size: (file.size / 1024 / 1024).toFixed(2) + " MB",
                    date: new Date().toLocaleDateString(),
                };

                setResumes([...resumes, newResume]);
            } else {
                alert(data.message);
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
                        accept=".pdf,.doc,.docx"
                        onChange={handleUpload}
                        hidden
                    />
                </label>
                <p>Supported formats: PDF, DOCX</p>
            </div>

            {resumes.length > 0 && (
                <div className="resume-list">
                    <h3>Uploaded Resumes</h3>
                    {resumes.map((resume, index) => (
                        <div className="resume-item" key={index}>
                            <div className="resume-info">
                                <FaFileAlt className="file-icon" />
                                <div>
                                    <strong>{resume.name}</strong>
                                    <p>Uploaded {resume.date} • {resume.size}</p>
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