// src/utils/apiFactory.ts
import { Options } from "ky";
import api from "../services/apiClient";
import { handleApiError } from "./errorHandler";

type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiCallerConfig = {
    method: ApiMethod;
    url: string;
    data?: unknown;
    responseType?: "json" | "blob" | "empty";
    searchParams?: Record<string, string | number | boolean>;
};

const normalizeUrl = (url: string) => {
    return url.replace(/^\/+/, "");
};

export const createApiCaller = <T>(config: ApiCallerConfig) => {
    return async (): Promise<T | null> => {
        try {
            const options: Options = {
                searchParams: config.searchParams,
            };

            if (config.data !== undefined) {
                options.json = config.data;
            }

            const request = api(normalizeUrl(config.url), {
                method: config.method,
                ...options,
            });

            if (config.responseType === "blob") {
                return (await request.blob()) as T;
            }

            if (config.responseType === "json" || config.responseType === undefined) {
                return await request.json<T>();
            }

            return null;
        } catch (error: unknown) {
             await handleApiError(error);
            return null;
        }
    };
};