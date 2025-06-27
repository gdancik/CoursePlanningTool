import {AxiosRequestConfig, AxiosResponse, AxiosError} from "axios";
import api from "../services/axios"
import {handleApiError} from "./errorHandler";

export const createApiCaller = <T>(config: AxiosRequestConfig) =>{
    return async (): Promise<T | null> => {
        try{
            const response: AxiosResponse<T> = await api.request(config);
            return response.data;
        }catch (error) {
            handleApiError(error);
            return null;
        }
    };
};