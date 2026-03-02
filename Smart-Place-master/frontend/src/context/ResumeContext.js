import React, { createContext, useState } from "react";

export const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
    const [analysis, setAnalysis] = useState(null);

    return (
        <ResumeContext.Provider value={{ analysis, setAnalysis }}>
            {children}
        </ResumeContext.Provider>
    );
};