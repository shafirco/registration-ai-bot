import React, { useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return alert("יש למלא את כל השדות");
    if (!/\S+@\S+\.\S+/.test(form.email))
      return alert("האימייל אינו תקין");
    if (form.password.length < 6)
      return alert("הסיסמה קצרה מדי");
    alert("נרשמת בהצלחה! (בשלב הבא זה יישלח לשרת)");
  };

  return (
    <div className="container">
      <h1>Registration</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default App;
