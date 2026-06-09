import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { HTTPError } from "ky";

import api from "../../services/apiClient";

import ReusableButton from "../../components/Button/ReusableButton";
import SafeIcon from "../../utils/ComponentWrapper";
import { FaHouse } from "react-icons/fa6";
import { GrLogout } from "react-icons/gr";

import type { ModalFactory } from "../../utils/useModalFactory";

type GoogleLoginResponse = {
    user: string;
    name: string;
};

type GoogleJwtPayload = {
    email?: string;
    name?: string;
    picture?: string;
    sub?: string;
};

type MyGoogleLoginProps = {
    auto_navigate?: boolean;
    modal: ModalFactory;
};

export default function MyGoogleLogin({
                                          auto_navigate = false,
                                          modal,
                                      }: MyGoogleLoginProps) {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async (
        credentialResponse: CredentialResponse
    ) => {
        try {
            const credential = credentialResponse.credential;

            if (!credential) {
                modal.showError("Google login failed: missing credential.");
                return;
            }

            const decoded = jwtDecode<GoogleJwtPayload>(credential);
            console.log("Decoded Google JWT:", decoded);

            modal.showRedirect(
                "Signing In",
                "Confirming your Google account...",
                "loading"
            );

            const data = await api
                .post("google_login", {
                    json: { jwt: credential },
                })
                .json<GoogleLoginResponse>();

            setUser({
                user: data.user,
                name: data.name,
            });

            modal.showRedirect(
                "Login Successful",
                `Welcome, ${data.name}!`,
                "success"
            );

            if (auto_navigate) {
                setTimeout(() => {
                    navigate("/course-page");
                }, 1500);
            } else {
                setTimeout(() => {
                    modal.hide();
                }, 1500);
            }
        } catch (error: unknown) {
            console.error("Google login error:", error);

            if (error instanceof HTTPError) {
                modal.showError(
                    `Unable to log in. Server returned ${error.response.status}.`,
                    error.response.status
                );
                return;
            }

            if (error instanceof Error) {
                modal.showError("Unable to log in: " + error.message);
                return;
            }

            modal.showError("Unable to log in.");
        }
    };

    const logout = async () => {
        try {
            modal.showRedirect(
                "Logging Out",
                "Ending your session...",
                "loading"
            );

            await api.get("logout/");
            setUser(null);

            modal.showRedirect(
                "Logged Out",
                "You have been logged out.",
                "success"
            );

            setTimeout(() => {
                modal.hide();
            }, 1500);
        } catch (error: unknown) {
            console.error("Logout error:", error);

            if (error instanceof HTTPError) {
                modal.showError(
                    `Unable to logout. Server returned ${error.response.status}.`,
                    error.response.status
                );
                return;
            }

            if (error instanceof Error) {
                modal.showError("Unable to logout: " + error.message);
                return;
            }

            modal.showError("Error: Unable to logout.");
        }
    };

    return (
        <div className="google-login-container">
            {user ? (
                <>
                    <p className="google-login-welcome">
                        Welcome, <b>{user.name}</b> ({user.user})
                    </p>

                    {!auto_navigate && (
                        <div className="google-login-actions">
                            <ReusableButton
                                label="Continue"
                                icon={<SafeIcon Icon={FaHouse} />}
                                variant="primary"
                                className="tight"
                                onClick={() => navigate("/course-page")}
                            />

                            <ReusableButton
                                label="Logout"
                                icon={<SafeIcon Icon={GrLogout} />}
                                variant="secondary"
                                className="tight red"
                                onClick={logout}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="google-login-card">
                    <h2>Welcome back</h2>
                    <p>Sign in with your Google account to continue.</p>
                    <GoogleLogin
                        theme="filled_blue"
                        size="large"
                        shape="pill"
                        text="signin_with"
                        logo_alignment="left"
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                            modal.showError("Google login failed.");
                        }}
                    />
                </div>
            )}
        </div>
    );
}