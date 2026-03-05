import React, { useContext } from "react";
import { ResumeContext } from "../../context/ResumeContext";
import "./SkillGap.css";

function SkillGap() {

    const context = useContext(ResumeContext);

    if (!context) {
        return (
            <div className="skillgap-container">
                <h2>Please upload resume first.</h2>
            </div>
        );
    }

    const analysis = context.analysis;

    if (!analysis || !analysis.results) {
        return (
            <div className="skillgap-container">
                <h2>Please upload resume first.</h2>
            </div>
        );
    }

    const matchedSkills = new Set();
    const missingSkills = new Set();
    const skillCount = {};

    let totalMatch = 0;

    analysis.results.forEach((job) => {

        totalMatch += job.match_percentage || 0;

        if (job.matched_skills && Array.isArray(job.matched_skills)) {
            job.matched_skills.forEach((skill) => matchedSkills.add(skill));
        }

        if (job.missing_skills && Array.isArray(job.missing_skills)) {

            job.missing_skills.forEach((skill) => {

                missingSkills.add(skill);

                if (!skillCount[skill]) {
                    skillCount[skill] = 1;
                } else {
                    skillCount[skill]++;
                }

            });

        }

    });

    const matched = Array.from(matchedSkills);
    const missing = Array.from(missingSkills);

    const avgMatch = Math.round(totalMatch / analysis.results.length);

    return (

        <div className="skillgap-container">

            <h2 className="skillgap-title">Skill Gap Analysis</h2>

            <div className="skillgap-grid">

                {/* Strengths */}

                <div className="strengths-box">

                    <h3>✔ Your Strengths</h3>

                    <div className="skills-list">

                        {matched.length === 0 && <p>No strengths detected</p>}

                        {matched.map((skill, i) => (
                            <span key={i} className="badge green">
                                {skill}
                            </span>
                        ))}

                    </div>

                </div>


                {/* Missing Skills */}

                <div className="missing-box">

                    <h3>⚠ Skills To Develop</h3>

                    {missing.length === 0 && <p>No missing skills</p>}

                    {missing.map((skill, i) => {

                        const demand = skillCount[skill] || 1;

                        const percent =
                            (demand / analysis.results.length) * 100;

                        return (

                            <div key={i} className="missing-item">

                                <div className="skill-row">
                                    <span>{skill}</span>
                                    <span>{demand} jobs</span>
                                </div>

                                <div className="progress-bar">
                                    <div
                                        className="progress"
                                        style={{ width: percent + "%" }}
                                    />
                                </div>

                            </div>

                        );

                    })}

                </div>

            </div>


            {/* Summary */}

            <div className="summary-box">

                <h3>Analysis Summary</h3>

                <div className="summary-grid">

                    <div className="summary-card">
                        <h4>{matched.length}</h4>
                        <p>Matched Skills</p>
                    </div>

                    <div className="summary-card">
                        <h4>{missing.length}</h4>
                        <p>Missing Skills</p>
                    </div>

                    <div className="summary-card">
                        <h4>{analysis.results.length}</h4>
                        <p>Jobs Analyzed</p>
                    </div>

                    <div className="summary-card">
                        <h4>{avgMatch}%</h4>
                        <p>Average Match</p>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default SkillGap;