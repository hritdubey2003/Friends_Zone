import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import '../PageCSS/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [snowflakes, setSnowflakes] = useState([]);

    // Snowfall Effect
    useEffect(() => {
        const snowArray = Array.from({ length: 100 }, (_, index) => ({
            id: index,
            left: Math.random() * 100,
            animationDuration: Math.random() * 5 + 3,
            size: Math.random() * 10 + 5,
            random: Math.random(),
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
                withCredentials: true,
            });

            setMessage("✅ Login Successful! 🎉");
            setIsSuccess(true);
            setFormData({ username: "", password: "" });

            // Save token
            localStorage.setItem("token", res.data.token);

            navigate("/home");
        } catch (error) {
            setMessage(`❌ ${error.response?.data?.message || "Invalid Credentials!"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="relative min-h-screen bg-[#0a192f]">
                {/* Snowfall Effect */}
                <div className="absolute top-0 left-0 right-0 bottom-0 z-10 pointer-events-none">
                    {snowflakes.map((snow) => (
                        <div
                            key={snow.id}
                            className="snowflake absolute"
                            style={{
                                left: `${snow.left}%`,
                                fontSize: `${snow.size}px`,
                                animationDuration: `${snow.animationDuration}s`,
                                "--random": snow.random,
                            }}
                        >
                            ❄️
                        </div>
                    ))}
                </div>

                {/* Login Form */}
                <div className="flex items-center justify-center min-h-screen z-20 relative px-4 py-8 sm:px-6 md:px-8">
                    <div className="bg-white bg-opacity-20 p-8 rounded-xl shadow-2xl w-full max-w-lg backdrop-blur-lg">
                        <h2 className="text-4xl font-semibold text-center text-gray-100 mb-6">
                            🔐 Login to Your Account
                        </h2>
                        <form onSubmit={handleSubmit} className={`space-y-6 ${isSuccess ? "bg-green-50" : ""}`}>
                            <input
                                type="text"
                                name="username"
                                placeholder="👤 Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full p-4 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-700"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="🔒 Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full p-4 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-700"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            >
                                {loading ? "🔄 Logging in..." : "🚀 Login Now"}
                            </button>
                        </form>

                        {message && (
                            <p className={`mt-4 text-center text-lg font-semibold ${isSuccess ? "text-green-500" : "text-red-500"}`}>
                                {message}
                            </p>
                        )}

                        <div className="mt-6 text-center text-gray-300">
                            <p>Don't have an account?</p>
                            <button
                                onClick={() => navigate("/register")}
                                className="mt-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
                            >
                                📝 Register Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
