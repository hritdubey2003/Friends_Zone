import { useState, useEffect } from "react";
import axios from "axios";
import "../Page.css/Login.css";
import Navbar from "../components/Navbar.jsx";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        // ❄️ Generate Snowflakes Randomly
        const snowArray = Array.from({ length: 50 }, (_, index) => ({
            id: index,
            left: Math.random() * 100,
            animationDuration: Math.random() * 5 + 3,
            size: Math.random() * 10 + 5,
            random: Math.random()
        }));
        setSnowflakes(snowArray);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setIsSuccess(false);

        if (!formData.username || !formData.password) {
            setMessage("⚠️ Please fill all required fields!");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", formData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true, // To store cookie-based session
            });

            setMessage("✅ Login Successful! 🎉");
            setIsSuccess(true);
            setFormData({ username: "", password: "" });

            // Save Token for Future Requests
            localStorage.setItem("token", res.data.token);
        } catch (error) {
            setMessage(`❌ ${error.response?.data?.message || "Invalid Credentials!"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Navbar />
        <div className="login-wrapper">
            {/* ❄️ Snowfall Effect */}
            <div className="snow-container">
                {snowflakes.map((snow) => (
                    <div
                        key={snow.id}
                        className="snowflake"
                        style={{
                            left: `${snow.left}%`,
                            fontSize: `${snow.size}px`,
                            animationDuration: `${snow.animationDuration}s`,
                            "--random": snow.random
                        }}
                    >
                        ❄️
                    </div>
                ))}
            </div>

            {/* 🔒 Login Form */}
            <div className="login-container">
                <h2>🔐 Login to Your Account</h2>
                <form onSubmit={handleSubmit} className={`form-box ${isSuccess ? "success" : ""}`}>
                    <input
                        type="text"
                        name="username"
                        placeholder="👤 Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="🔒 Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? "🔄 Logging in..." : "🚀 Login Now"}
                    </button>
                </form>
                {message && <p className={`message ${isSuccess ? "success-text" : "error-text"}`}>{message}</p>}
            </div>
        </div>
        </>
    );
};

export default Login;
