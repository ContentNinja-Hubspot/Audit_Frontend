import React, { useState } from "react";

const UserForm = ({ onAddUser }) => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Both name and email are required.");
      return;
    }
    onAddUser(form);
    setForm({ name: "", email: "" });
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        className="border px-2 py-1 mr-2"
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        className="border px-2 py-1 mr-2"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <button
        className="bg-purple-600 text-white px-4 py-1 rounded"
        type="submit"
      >
        Add User
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default UserForm;
