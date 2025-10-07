import React, { useState, useContext, useEffect } from "react";
import { MainContext } from "../context/MainContext";
import CryptoJS from "crypto-js";
import axios from "axios";
import { FiEye, FiEdit, FiTrash2, FiCopy, FiRefreshCcw } from "react-icons/fi";

export default function Vault() {
  const { API, items, setItems, token, fetchItems } = useContext(MainContext);
  const secretKey = "mySecretKey";

  const [form, setForm] = useState({ title: "", username: "", password: "", url: "", notes: "" });
  const [editId, setEditId] = useState(null);
  const [showPassword, setShowPassword] = useState({});

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const generatePassword = length => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let pwd = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) pwd += chars[array[i] % chars.length];
    setForm(prev => ({ ...prev, password: pwd }));
  };

  const handleCopy = pwd => {
    navigator.clipboard.writeText(pwd);
    alert("Password copied!");
  };

  const togglePassword = id => setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));

  const getStrength = pwd => {
    if (!pwd) return "";
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return "Weak";
    if (score === 2) return "Medium";
    return "Strong";
  };
  const strength = getStrength(form.password);

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = { ...form, password: CryptoJS.AES.encrypt(form.password, secretKey).toString() };

    try {
      if (editId) {
        await axios.put(`${API}/vault/${editId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API}/vault`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      setForm({ title: "", username: "", password: "", url: "", notes: "" });
      setEditId(null);
      await fetchItems();
    } catch (err) {
      console.error(err);
      alert("Error saving item");
    }
  };

  const handleEdit = item => {
    setForm({ ...item });
    setEditId(item._id);
  };

  const handleDelete = async id => {
    if (!window.confirm("Are you sure to delete this item?")) return;
    try {
      await axios.delete(`${API}/vault/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchItems();
    } catch (err) {
      console.error(err);
      alert("Error deleting item");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-gray-100">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col gap-4 mb-6">
        {["title", "username", "password", "url", "notes"].map(f => (
          <div key={f} className="flex flex-col gap-2 relative">
            <input
              type={f === "password" ? "text" : "text"}
              name={f}
              placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
              value={form[f]}
              onChange={handleChange}
              className="bg-gray-700 border border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={f === "title" || f === "password"}
            />
            {f === "password" && (
              <div className="flex gap-2 mt-2 items-center">
                <button
                  type="button"
                  onClick={() => generatePassword(12)}
                  className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded flex items-center gap-1 transition duration-150"
                >
                  <FiRefreshCcw /> Gen
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(form.password)}
                  className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded flex items-center gap-1 transition duration-150"
                >
                  <FiCopy /> Copy
                </button>
                {form.password && (
                  <span
                    className={`ml-auto font-semibold ${
                      strength === "Weak" ? "text-red-500" : strength === "Medium" ? "text-yellow-400" : "text-green-400"
                    }`}
                  >
                    {strength}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-150">
          {editId ? "Update" : "Add"} Item
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <p className="col-span-full text-center text-gray-400">No items found</p>
        ) : (
          items.map(i => (
            <div key={i._id} className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-xl transition flex flex-col gap-2">
              <h3 className="font-bold text-lg text-blue-400">{i.title}</h3>
              <p><strong>Username:</strong> {i.username}</p>
              <p>
                <strong>Password:</strong> {showPassword[i._id] ? i.password : "••••••••"}
                <button onClick={() => togglePassword(i._id)} className="ml-2 text-blue-500 hover:text-blue-400 transition">
                  <FiEye />
                </button>
                <button onClick={() => handleCopy(i.password)} className="ml-2 text-green-500 hover:text-green-400 transition">
                  <FiCopy />
                </button>
              </p>
              {i.url && <p><strong>URL:</strong> <a href={i.url} target="_blank" className="text-blue-300 hover:underline">{i.url}</a></p>}
              {i.notes && <p><strong>Notes:</strong> {i.notes}</p>}
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEdit(i)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1 transition">
                  <FiEdit /> Edit
                </button>
                <button onClick={() => handleDelete(i._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 transition">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
