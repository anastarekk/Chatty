import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {
        await api.post("/auth/register", {
            username,
            email,
            password,
        });

        navigate("/");
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow w-96">
                <h1 className="text-2xl font-bold mb-6">Register</h1>

                <input
                    className="w-full p-2 border mb-3"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />

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
                    onClick={handleRegister}
                    className="w-full bg-green-500 text-white p-2 rounded"
                >
                    Register
                </button>
            </div>
        </div>
    );
}