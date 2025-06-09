import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import ecsuBlack from '../assets/images/ecsu-logo-black-stacked-alt.png';
import "./LoginScreen.css";

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { message, error, handleLogin, handleLogout } = useLogin();
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await handleLogin(username, password);
            setLoginSuccess(true);
            setTimeout(() => {
                navigate("/overview");
            }, 3000);
        } catch (err) {
            console.error(err);
            setLoginSuccess(false);
        }
    };


    return (
        <div className="login-page-wrapper">
            {/* Logo */}
            <div className="logo-container">
                <img
                    src={ecsuBlack}
                    alt="Eastern Connecticut State University Logo"
                    className="logo"
                />
            </div>

            <div className="login-page-container">
                {/* Left Section */}
                <div className="left-section">
                    <h1>Course Planning Tool</h1>
                    <p>
                        This course planning tool is an interactive platform that makes it easy to design your courses and download a complete syllabus through guided steps. You can edit and duplicate your courses as often as needed. Whether you're creating an ELAC course or any other type of course, this tool will streamline your planning process.
                    </p>
                    <p className="details-bottom">
                        Create an account or login to get started.
                    </p>
                </div>

                {/* Right Section */}
                <div className="right-section">
                    <form onSubmit={handleSubmit} className="login-form">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Login</button>
                    </form>

                    {loginSuccess && (
                        <p className="success-message">
                            {`Welcome, ${username}! Redirecting in 3 seconds...`}
                        </p>
                    )}
                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
