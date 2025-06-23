import React from "react";
import { Link } from "react-router-dom";
import { showErrorModal } from "../../utils/errorHandler";

const TestPage: React.FC = () => {
    const triggerError = (code: number) => {
        showErrorModal({
            message: `Simulated error for status ${code}`,
            code,
        });
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1> Component Test Page</h1>
            <ul style={{ lineHeight: "2rem", listStyle: "square" }}>
                <li><Link to="/courseSchedule">Course Schedule Page</Link></li>
                <li><Link to="/grade-table">Grade Table Page</Link></li>
            </ul>

            <div style={{ marginTop: "2rem" }}>
                <h2>Trigger Error Modals</h2>
                <button onClick={() => triggerError(400)}>Trigger 400 (Bad Request)</button><br/>
                <button onClick={() => triggerError(401)}>Trigger 401 (Unauthorized)</button><br/>
                <button onClick={() => triggerError(404)}>Trigger 404 (Not Found)</button><br/>
                <button onClick={() => triggerError(500)}>Trigger 500 (Internal Server Error)</button><br/>
                <button onClick={() => triggerError(999)}>Trigger Unknown Error</button>
            </div>
        </div>
    );
};

export default TestPage;
