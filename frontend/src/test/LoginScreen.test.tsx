import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginScreen from "../screens/LoginScreen";

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate,
}));

// Mock useLogin hook with reactive state!
jest.mock("../hooks/useLogin", () => {
    const ReactImport = require("react");

    return {
        useLogin: () => {
            const [error, setError] = ReactImport.useState(null);

            const handleLogin = (user: string, password: string) => {
                if (password === "password") {
                    setError(null);
                    return Promise.resolve({ user });
                } else {
                    setError("Invalid password");
                    return Promise.reject(new Error("Invalid password"));
                }
            };

            const handleLogout = jest.fn();

            return {
                message: null,
                error,
                handleLogin,
                handleLogout,
            };
        },
        __esModule: true,
    };
});

describe("LoginScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should display success and redirect if login is successful", async () => {
        render(
            <BrowserRouter>
                <LoginScreen />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: "annie" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "password" },
        });

        fireEvent.click(screen.getByText("Login"));

        expect(
            await screen.findByText(/Welcome, annie! Redirecting in 3 seconds/i)
        ).toBeInTheDocument();

        await waitFor(
            () => {
                expect(mockedNavigate).toHaveBeenCalledWith("/overview");
            },
            { timeout: 3500 }
        );
    });

    it("should display error and not redirect if password is incorrect", async () => {
        render(
            <BrowserRouter>
                <LoginScreen />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: "annie" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "wrongpassword" },
        });

        fireEvent.click(screen.getByText("Login"));

        // Print DOM to debug
        screen.debug();

        // Use fallback matcher for error text
        expect(
            await screen.findByText((_, element) => element?.textContent === "Invalid password")
        ).toBeInTheDocument();

        expect(mockedNavigate).not.toHaveBeenCalled();
    });
});
