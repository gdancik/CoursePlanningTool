import {AxiosError} from "axios";


type ErrorModalArgs = {message: string; code?: number};
//Internal callback that can be updated by App
let modalCallBack: (error: ErrorModalArgs) => void = ({message, code}) =>{
    console.error("Modal not initialized:", message, code);
};


// This is what your API calls use
export const showErrorModal = (error: ErrorModalArgs) => {
    modalCallBack(error);
};

// This allows AppRoutes or App.tsx to inject the real modal logic
export const setErrorModalHandler = (handler: (error: ErrorModalArgs) => void) => {
    modalCallBack = handler;
};

export const handleApiError= (error: unknown):void =>{
    const axiosError = error as AxiosError;
 
    if(!axiosError.response){
        showErrorModal({message:"Network Error. Please check your internet connection."});
        return;
    }

    const {status} = axiosError.response;

    switch (status) {
        case 400:
            showErrorModal({message: "Bad Request: Please Check your form entries.", code: 400});
            break;
        case 401:
            showErrorModal({message:"Unauthorized: Please login again.", code: 401});
            break;
        case 404:
            showErrorModal({message:"NotFound: The request resource is missing.", code: 404});
            break;
        case 500:               
            showErrorModal({message:"Server Error: Please try again later", code: 500});            
            break;
        case 429:
            showErrorModal({message:"Rate limit exceeded: Please try again later", code: 429});            
            break;
        default:
            showErrorModal({ message: `Unexpected error occurred.`, code: status });
    }
};
