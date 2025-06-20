import {AxiosError} from "axios";

//Internal callback that can be updated by App
let modalCallBack: (msg: string) => void = (msg) =>{
    console.error("Modal not initialized:", msg);
};


// This is what your API calls use
export const showErrorModal = (msg: string) => {
    modalCallBack(msg);
};

// This allows AppRoutes or App.tsx to inject the real modal logic
export const setErrorModalHandler = (handler: (msg: string) => void) => {
    modalCallBack = handler;
};

export const handleApiError= (error: unknown):void =>{
    const axiosError = error as AxiosError;

    if(!axiosError.response){
        showErrorModal("Network Error. Please check your internet connection.");
        return;
    }
    const {status} = axiosError.response;

    switch (status) {
        case 400:
            showErrorModal("Bad Request: Please Check your form entries.");
            break;
        case 401:
            showErrorModal("Unauthorized: Please login again.");
            break;
        case 404:
            showErrorModal("NotFound: Request resource is missing.");
            break;
        case 500:
            showErrorModal("Server Error: please try again later.");
        default:
            showErrorModal(`Unexpected error: ${status}`);
    }
};