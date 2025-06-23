import React from "react";
import { Link } from "react-router-dom";
import { showErrorModal } from "../../utils/errorHandler";

const TestPage: React.FC = () => {
    const triggerTestError = () => {
        showErrorModal({
            message: "This is a test Error",
            code: 999,
        });
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1> Component Test Page</h1>
            <ul style={{ lineHeight: "2rem", listStyle: "square" }}>
                <li><Link to="/courseSchedule">Course Schedule Page</Link></li>
                <li><Link to="/grade-table">Grade Table Page</Link></li>
            </ul>

            <button onClick={triggerTestError} style={{ marginTop: "2rem", padding: "0.5rem 1rem" }}>
                 Trigger Error Modal
            </button>
        </div>
    );
};

export default TestPage;
