import { useState } from "react";
export type ModalStatus = "loading" | "success" | "error";
export type ModalType = "redirect" | "error" | "course" | "custom";

export interface ModalFactory {
    visible: boolean;
    type: ModalType;
    status: ModalStatus;
    title: string;
    message: string;
    payload?: any;
    showRedirect: (title: string, message: string, status?: ModalStatus) => void;
    showError: (message: string, errorCode?: number) => void;
    showCourseModal: (data?: any) => void;
    showCustomModal: (customName: string, props?: any) => void;
    hide: () => void;
}

export function useModalFactory(): ModalFactory {
    const [visible, setVisible] = useState (false);
    const [type, setType] = useState<ModalType>("redirect");
    const [status, setStatus] = useState<ModalStatus> ("loading");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [payload, setPayload] = useState<any>(null);

    const showRedirect = (titleText: string, messageText: string, modalStatus: ModalStatus =  "loading") =>{
        setVisible(true);
        setType("redirect");
        setStatus(modalStatus);
        setTitle(titleText);
        setMessage(messageText)
    };

    const showError = (message: string, errorCode?: number) => {
        setVisible(true);
        setType("error");
        setStatus("error")
        setTitle("Error")
        setMessage(message);
        setPayload(errorCode);
        setTimeout(() => setVisible(false), 5000);
    };

    const showCourseModal = (data?: any) => {
        setVisible(true);
        setType("course");
        setStatus("loading")
        setTitle("New Course");
        setMessage("Enter Course Details");
        setPayload( data ||{});
    };

    const showCustomModal = (customName: string, props?: any) => {
        setVisible(true);
        setType("custom");
        setStatus("success")
        setTitle(customName);
        setPayload(props ||{});
    };

    const hide = () => {
        setVisible(false);
        setPayload(null);
    };

    return {
        visible,
        type,
        status,
        title,
        message,
        payload,
        showRedirect,
        showError,
        showCourseModal,
        showCustomModal,
        hide,
    };
}