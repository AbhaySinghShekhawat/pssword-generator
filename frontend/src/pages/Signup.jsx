import React, { useState, useContext } from "react";
import { MainContext } from "../context/MainContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Signup() {
  const { API, setUser, setToken } = useContext(MainContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [genPassword, setGenPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generatePassword = (length = 12) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let pwd = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      pwd += chars[array[i] % chars.length];
    }
    return pwd;
  };

  const handleGenerate = () => {
    const pwd = generatePassword(12);
    setGenPassword(pwd);
  };

  const handleCopy = () => {
    if (!genPassword) return;
    navigator.clipboard.writeText(genPassword);
    setPassword(genPassword);
    setGenPassword("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/signup`, { email, password });
      
      const user = res.data.user;
      const token = res.data.token;

      if (!user || !token) {
        alert("Signup success but missing user/token!");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      setUser(user);
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      alert("Signup successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password or use generator"
              className="border p-2 rounded w-full pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-600"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <div className="p-4 border rounded shadow-sm flex flex-col gap-2">
            <button type="button" onClick={handleGenerate} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Generate Password
            </button>
            {genPassword && (
              <div className="flex gap-2 items-center">
                <input type="text" readOnly value={genPassword} className="border px-2 py-1 rounded flex-grow" />
                <button type="button" onClick={handleCopy} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  Copy
                </button>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
