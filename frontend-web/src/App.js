import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.ai_message || "נרשמת בהצלחה!");
        setForm({ name: "", email: "", password: "" });
      } else {
        toast.error(data.detail || "שגיאה בהרשמה");
      }
    } catch (err) {
      toast.error("שרת לא זמין");
      console.error(err);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">צור חשבון חדש</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="שם מלא"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="אימייל"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="סיסמה"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="register-btn">
            הרשמה
          </button>
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={4000} />
    </div>
  );
}

export default App;
