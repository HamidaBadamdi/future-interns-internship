
import { useState } from "react";
import { loginAdmin } from "../services/authService";

function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await loginAdmin(email, password);

            onLogin(result);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-brand">
                    Lead<span>Flow</span>
                </div>

                <p className="login-eyebrow">ADMIN PORTAL</p>

                <h1>Welcome back</h1>

                <p className="login-description">
                    Sign in to manage your leads and track your business.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your admin email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="login-error" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="login-footer">
                    Secure administrator access · LeadFlow
                </p>
            </div>
        </div>
    );
}

export default Login;
