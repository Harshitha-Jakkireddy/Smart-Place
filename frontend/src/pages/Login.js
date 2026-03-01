import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [activeTab, setActiveTab] = useState("signin");
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {

    // ✅ Empty validation
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    // ✅ Role validation during signup
    if (activeTab === "signup" && !selectedRole) {
      alert("Please select a role");
      return;
    }

    try {

      const url =
        activeTab === "signup"
          ? "http://127.0.0.1:5000/register"
          : "http://127.0.0.1:5000/login";

      const bodyData =
        activeTab === "signup"
          ? { email, password, role: selectedRole }
          : { email, password };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      // ✅ Signup success
      if (activeTab === "signup") {
        alert("Account created successfully!");
        setActiveTab("signin");
        setEmail("");
        setPassword("");
        setSelectedRole("");
        return;
      }

      // ✅ Login success
      localStorage.setItem("role", data.role);

      // ✅ Role based navigation
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }

    } catch (error) {
      console.error(error);
      alert("Backend server not running!");
    }
  };

  return (
    <div className="login-container">

      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="branding">
          <h1>Smart Place</h1>
          <h3>AI-Powered Campus Placement System</h3>
          <p>
            Automate resume screening, match candidates with jobs using AI,
            and enable smart placement decisions.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className="login-box">

          <h2>Welcome</h2>

          <div className="tab-buttons">
            <button
              className={activeTab === "signin" ? "active" : ""}
              onClick={() => setActiveTab("signin")}
            >
              Sign In
            </button>

            <button
              className={activeTab === "signup" ? "active" : ""}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {activeTab === "signup" && (
            <>
              <p>Select Role</p>

              <div className="role-buttons">
                <button
                  className={`role-btn ${
                    selectedRole === "student" ? "active-role" : ""
                  }`}
                  onClick={() => setSelectedRole("student")}
                >
                  🎓 Student
                </button>

                <button
                  className={`role-btn ${
                    selectedRole === "admin" ? "active-role" : ""
                  }`}
                  onClick={() => setSelectedRole("admin")}
                >
                  🛠 Admin
                </button>
              </div>
            </>
          )}

          <button className="login-btn" onClick={handleSubmit}>
            {activeTab === "signin" ? "Login" : "Create Account"}
          </button>

        </div>
      </div>

    </div>
  );
}

export default Login;