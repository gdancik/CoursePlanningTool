import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import ecsuBlack from '../../assets/images/ecsu-logo-black-stacked-alt.png';
import "./LoginScreen.css";
import LoginIcon from '../../assets/images/Login_Page_Icon.png'
import RedirectingModal from "../../components/RedirectingModal/RedirectingModal";

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { error, handleLogin } = useLogin();
    const navigate = useNavigate();

    // New modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [modalStatus, setModalStatus] = useState<"loading" | "success">("loading");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Show modal in loading state
            setModalTitle("Logging In");
            setModalMessage("Please wait while we verify your credentials...");
            setModalStatus("loading");
            setModalVisible(true);

            await handleLogin(username, password);

            // On success
            setModalStatus("success");
            setModalTitle("Login Successful");
            setModalMessage("Welcome! Redirecting to your course page...");

            setTimeout(() => {
                setModalVisible(false);
                navigate("/course-page");
            }, 1500);
        } catch (err) {
            console.error(err);
            setModalVisible(false);
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
                        This course planning tool is an interactive platform that makes it easy to design your courses and download a complete syllabus through guided steps.
                        You can edit and duplicate your courses as often as needed. Whether you're creating an ELAC course or any other type of course, this tool will streamline your planning process.
                    </p>
                    <p className="details-bottom">
                        Create an account or login to get started.
                    </p>

                    <h2>How It Works:</h2>
                    <div className="how-block">
                        <img
                        src = {LoginIcon}
                        alt = "Login Icon"
                        className="icon-login"
                        />

                        <div className="description-container">
                            <div> Create A New Course <br/> or Edit An Existing Course.</div>
                            <div>Develop or Edit Your Course <br/> Through Guided, Step-by-step Planning Tool</div>
                            <div>Generate Your Course Syllabus As A <br/> Word Document</div>
                        </div>
                    </div>
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

                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>

            {/* Reusable modal with props */}
            <RedirectingModal
                visible={modalVisible}
                status={modalStatus}
                title={modalTitle}
                message={modalMessage}
            />
        </div>
    );
};

export default LoginScreen;
