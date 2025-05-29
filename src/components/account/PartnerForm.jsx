import React, { useState } from "react";

const PartnerForm = ({ onAddUser }) => {
  const [form, setForm] = useState({ name: "", email: "", role: "user" });
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
    <>
      <h2 className="text-lg text-start font-semibold mb-4">Add New Partner</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First row: inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="mb-1 text-sm font-bold text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm font-bold text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="role"
              className="mb-1 text-sm font-bold text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Second row: button centered */}
        <div className="flex justify-center">
          <button type="submit">+ Add Partner</button>
        </div>
      </form>

      {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
    </>
  );
};

export default PartnerForm;
