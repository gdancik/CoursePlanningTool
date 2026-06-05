// src/utils/errorHandler.ts
import { HTTPError } from "ky";

type ErrorModalArgs = { message: string; code?: number };

let modalCallBack: (error: ErrorModalArgs) => void = ({ message, code }) => {
    console.error("Modal not initialized:", message, code);
};

export const showErrorModal = (error: ErrorModalArgs) => {
    modalCallBack(error);
};

export const setErrorModalHandler = (
    handler: (error: ErrorModalArgs) => void
) => {
    modalCallBack = handler;
};

export const handleApiError = async (error: unknown): Promise<void> => {
    if (!(error instanceof HTTPError)) {
        showErrorModal({
            message: "Network Error. Please check your internet connection.",
        });
        return;
    }

    const { status } = error.response;

    try {
        const text = await error.response.text();
        if (text) {
            console.log("Error response is below:");
            console.log(text);
        }
    } catch {
        console.log("Could not read error response body.");
    }

    switch (status) {
        case 400:
            showErrorModal({
                message: "Bad Request: Please check your form entries.",
                code: 400,
            });
            break;
        case 401:
            showErrorModal({
                message: "Unauthorized: Please login again.",
                code: 401,
            });
            break;
        case 404:
            showErrorModal({
                message: "Not Found: The requested resource is missing.",
                code: 404,
            });
            break;
        case 429:
            showErrorModal({
                message: "Rate limit error: Your daily usage limit has been reached.",
                code: 429,
            });
            break;
        case 500:
            showErrorModal({
                message: "Server Error: Please try again later.",
                code: 500,
            });
            break;
        default:
            showErrorModal({
                message: "Unexpected error occurred.",
                code: status,
            });
    }
};