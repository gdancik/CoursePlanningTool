import api from "../apiClient";
import {HTTPError} from "ky";

export const login = async (
    user: string,
    password: string
): Promise <{user: string}> => {
    try {
        return await api
            .get("test_login/", {
                searchParams: {
                    user,
                    password,
                },
            })
            .json<{user: string}>();
    } catch  (err: unknown) {
        if (err instanceof HTTPError) {
            if(err.response.status === 401) {
                throw new Error("Invalid password")
            }
            if (err.response.status === 400) {
                throw new Error("Invalid format or missing parameters");
            }
        }

        throw new Error("Unknown error occurred");
    }
};

export const logout = async (): Promise<void> => {
    await api.get("test_logout/");
};

export const getTestData = async () => {
    return await api.get("test_data/").json();
};