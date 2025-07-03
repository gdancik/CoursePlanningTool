import React, { useState } from "react";
import { Link } from "react-router-dom";
import { showErrorModal } from "../utils/errorHandler";
import RedirectingModal from './../components/RedirectingModal/RedirectingModal';
import {CompetencyTable1, CompetencyTable2} from './../components/competencyTable';
import {
    createSaveHandler,
    createSaveAndExitHandler,
    createPreviewHandler
} from "../utils/handlers/formHandlersFactory";

const TestPage: React.FC = () => {
    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalStatus, setModalStatus] = useState<"loading" | "success">("loading");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    // Dummy form data for testing
    const dummyFormData = {
        "Instructor Name": "Jane Doe",
        "Course Title": "Advanced Simulation",
        "Term": "Fall 2025"
    };

    // Modal controls to pass into handlers
    const modalControls = {
        setVisible: setModalVisible,
        setStatus: setModalStatus,
        setTitle: setModalTitle,
        setMessage: setModalMessage
    };

    // Mock navigation
    const simulateNavigate = (path: string) => {
        console.log(`Redirecting to: ${path}`);
    };

    // Handlers using your real factory logic
    const handleSimulateSave = async () => {
        setModalTitle("Saving Changes");
        setModalMessage("Please wait while we save your data...");
        setModalStatus("loading");
        setModalVisible(true);

        await new Promise((res) => setTimeout(res, 2000));

        setModalStatus("success");
        setModalTitle("Saved!");
        setModalMessage("Your changes have been saved successfully.");

        setTimeout(() => setModalVisible(false), 1500);
    };


    const simulateSaveAndExit = createSaveAndExitHandler(dummyFormData, simulateNavigate, modalControls);
    const simulatePreview = createPreviewHandler(dummyFormData, modalControls);

    // Simulated error trigger
    const triggerError = (code: number) => {
        showErrorModal({
            message: `Simulated error for status ${code}`,
            code,
        });
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Component Test Page</h1>
            <ul style={{ lineHeight: "2rem", listStyle: "square" }}>
                <li><Link to="/courseSchedule">Course Schedule Page</Link></li>
                <li><Link to="/grade-table">Grade Table Page</Link></li>
            </ul>

            <div style={{ marginTop: "2rem" }}>
                <h2>Trigger Error Modals</h2>
                <button onClick={() => triggerError(400)}>Trigger 400 (Bad Request)</button><br />
                <button onClick={() => triggerError(401)}>Trigger 401 (Unauthorized)</button><br />
                <button onClick={() => triggerError(404)}>Trigger 404 (Not Found)</button><br />
                <button onClick={() => triggerError(500)}>Trigger 500 (Internal Server Error)</button><br />
                <button onClick={() => triggerError(999)}>Trigger Unknown Error</button>
            </div>

            <div style={{ marginTop: "2rem" }}>
                <h2>Simulate Real Form Logic</h2>
                <button onClick={handleSimulateSave}>Simulate Save</button><br />
                <button onClick={simulateSaveAndExit}>Simulate Save and Exit</button><br />
                <button onClick={simulatePreview}>Simulate Preview Download</button>
            </div>

            <RedirectingModal
                visible={modalVisible}
                status={modalStatus}
                title={modalTitle}
                message={modalMessage}
            />
	
	    <div style = {{ marginTop: "2rem" }}>
		<CompetencyTable2/>
	    </div>
        </div>


    );
};

export default TestPage;
