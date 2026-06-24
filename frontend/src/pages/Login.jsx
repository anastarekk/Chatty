import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const res = await api.post("/auth/login", {
            email,
            password,
        });

        localStorage.setItem("token", res.data.token);
        navigate("/chat");
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow w-96">
                <h1 className="text-2xl font-bold mb-6">Login</h1>

                <input
                    className="w-full p-2 border mb-3"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="w-full p-2 border mb-3"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Login
                </button>

                <button
                    onClick={() => navigate("/register")}
                    className="w-full mt-3 border border-blue-500 text-blue-500 p-2 rounded"
                >
                    Register
                </button>
            </div>
        </div>
    );
}