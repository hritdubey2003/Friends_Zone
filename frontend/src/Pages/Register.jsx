import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from '../components/Navbar.jsx';
import { useNavigate } from "react-router-dom";
import "../PageCSS/Register.css";

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
        // Generate random snowflakes for effect
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
            const res = await axios.post("https://localhost:5000/api/auth/register", formData, {
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
            <div className="relative min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black">
                {/* Snowfall Effect */}
                <div className="absolute top-0 left-0 right-0 bottom-0 z-10 pointer-events-none">
                    {snowflakes.map((snow) => (
                        <div
                            key={snow.id}
                            className="snowflake absolute animate-snowfall"
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

                {/* Mountain Background */}
                <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-gray-800 to-transparent z-0">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 400">
                        <path fill="#2D3748" d="M0,320 L100,256 L200,288 L300,192 L400,256 L500,192 L600,256 L700,160 L800,224 L900,128 L1000,192 L1100,256 L1200,192 L1300,224 L1400,160 L1500,256 L1600,320 Z" />
                    </svg>
                </div>

                {/* Registration Form */}
                <div className="flex items-center justify-center min-h-screen z-20 relative px-4 py-8 sm:px-6 md:px-8">
                    <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                            <input
                                type="text"
                                name="interests"
                                placeholder="Interests (comma separated)"
                                value={formData.interests}
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            >
                                {loading ? "Registering..." : "Register Now"}
                            </button>
                        </form>

                        {message && (
                            <p className={`mt-4 text-center text-lg font-semibold ${isSuccess ? "text-green-500" : "text-red-500"}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
