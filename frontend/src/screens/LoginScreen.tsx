import React, {useState} from "react";
import {useLogin} from "../hooks/useLogin";

const LoginScreen: React.FC =  () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {message, error, handleLogin, handleLogout} = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin(username, password);
    };

    return(
        <div className="main">
            <div className="login-container">
                <h1>Course Planning Tool</h1>
                <p className="Details">
                    This course planning tool is an interactive platform that makes it easy to design your courses and
                    download a completed syllabus through guided steps. You can edit and duplicate your courses as often
                    as needed. Whether you're creating an ELAC course or any other type of course, this tool will
                    streamline
                    your planning process.
                </p>
                <p className="details-bottom">
                    Create an account or login to get started.
                </p>
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

                {message && <p className="message-succcess">{message}</p>}
                <button onClick={handleLogout} style={{marginTop: "0.5rem"}}>Logout</button>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
};

export default LoginScreen;