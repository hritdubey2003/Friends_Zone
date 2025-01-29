import { useState, useEffect } from "react";
import axios from "axios";
import "../Page.css/Register.css";
import Navbar from '../components/Navbar.jsx';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        interests: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        // ❄️ Generate random snowflakes
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

        if (!formData.username || !formData.email || !formData.password) {
            setMessage("⚠️ Please fill all required fields!");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", formData, {
                headers: { "Content-Type": "application/json" },
            });

            setMessage("✅ Registration Successful! 🎉");
            setIsSuccess(true);
            setFormData({ username: "", email: "", password: "", interests: "" });
            navigate("/login");
        } catch (error) {
            setMessage(`❌ ${error.response?.data?.message || "Something went wrong!"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Navbar />
        <div className="register-wrapper">
            {/* 🎯 Snowfall Effect */}
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

            {/* 🎯 Registration Form */}
            <div className="register-container">
                <h2>🚀 Create an Account</h2>
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
                        type="email"
                        name="email"
                        placeholder="📧 Email"
                        value={formData.email}
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
                    <input
                        type="text"
                        name="interests"
                        placeholder="🎭 Interests (comma separated)"
                        value={formData.interests}
                        onChange={handleChange}
                    />
                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? "🔄 Registering..." : "🚀 Register Now"}
                    </button>
                </form>
                {message && <p className={`message ${isSuccess ? "success-text" : "error-text"}`}>{message}</p>}
            </div>
        </div>
        </>
    );
};

export default Register;
