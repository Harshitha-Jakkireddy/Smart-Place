import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ResumeProvider } from "./context/ResumeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <ResumeProvider>
      <App />
    </ResumeProvider>
  </BrowserRouter>
);