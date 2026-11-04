
import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./Dashboard";

function App() {
    const [token, setToken] = useState(
        () => sessionStorage.getItem("leadflow_token")
    );

    const [admin, setAdmin] = useState(() => {
        try {
            return JSON.parse(
                sessionStorage.getItem("leadflow_admin") || "null"
            );
        } catch {
            return null;
        }
    });

    const handleLogin = (result) => {
        if (!result?.success || !result?.token || !result?.admin) {
            return;
        }

        sessionStorage.setItem("leadflow_token", result.token);
        sessionStorage.setItem(
            "leadflow_admin",
            JSON.stringify(result.admin)
        );

        setAdmin(result.admin);
        setToken(result.token);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("leadflow_token");
        sessionStorage.removeItem("leadflow_admin");

        setToken(null);
        setAdmin(null);
    };

    if (!token || !admin) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="authenticated-app">
            <div className="session-bar">
                <span>
                    Signed in as <strong>{admin.name}</strong>
                </span>

                <button
                    type="button"
                    className="session-logout"
                    onClick={handleLogout}
                >
                    Log out
                </button>
            </div>

            <Dashboard />
        </div>
    );
}

export default App;
