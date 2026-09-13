import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const loadUser = () => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        loadUser();

        window.addEventListener("login", loadUser);
        window.addEventListener("logout", loadUser);

        return () => {
            window.removeEventListener("login", loadUser);
            window.removeEventListener("logout", loadUser);
        };
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

        window.dispatchEvent(new Event("logout"));

        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">

                <Link to="/" className="logo">
                    🤖 ChatGenie
                </Link>

                <div className="nav-links">

                    <Link to="/">
                        Home
                    </Link>

                    {user ? (
                        <>
                            <Link to="/chat">
                                Chat
                            </Link>

                            <span className="welcome-user">
                                Hi, {user.name} 👋
                            </span>

                            <button
                                className="nav-logout-btn"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                Login
                            </Link>

                            <Link to="/register">
                                Register
                            </Link>
                        </>
                    )}

                </div>

            </div>
        </nav>
    );
}

export default Navbar;