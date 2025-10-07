import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const API = "http://localhost:5000";
    const secretKey = "mySecretKey";


  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  axios.defaults.withCredentials = true;
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return setLoading(false);
      try {
        const res = await axios.get(`${API}/auth/current-user/${user._id}`);
        if (res.data.status === 1 && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Fetch user failed:", err);
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []); 

  const fetchItems = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API}/vault`);
      if (res.data.status === 1) {
        const decrypted = res.data.items.map(item => ({
          ...item,
          password: CryptoJS.AES.decrypt(item.password, secretKey).toString(CryptoJS.enc.Utf8)
        }));
        setItems(decrypted);
        localStorage.setItem("vaultItems", JSON.stringify(decrypted));
      }
    } catch (err) {
      console.error("Fetch items failed:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    if (res.data.status === 1) {
      const user = res.data.user;
      const token = res.data.token;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      setUser(user);
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return res.data;
  };

  return (
    <MainContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        fetchItems,
        API,
        items,
        setItems,
        setUser,
        setToken
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
