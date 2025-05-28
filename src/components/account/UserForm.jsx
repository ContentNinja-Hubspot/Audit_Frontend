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
    <>
      <h2 className="text-lg text-start font-semibold mb-4">Add New User</h2>
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
        </div>

        {/* Second row: button centered */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md text-sm"
          >
            + Add User
          </button>
        </div>
      </form>

      {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
    </>
  );
};

export default UserForm;
