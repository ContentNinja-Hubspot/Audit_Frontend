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
      <div>
        <h2 className="text-lg text-start font-semibold mb-4">Add New User</h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 mb-4"
      >
        <div className="flex flex-col w-full md:w-1/3">
          <label className="mb-1 text-sm text-start font-bold text-gray-700">
            Name
          </label>
          <input
            className="border border-gray-300 px-3 py-2 rounded"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />
        </div>

        <div className="flex flex-col w-full md:w-1/3">
          <label className="mb-1 text-sm text-start font-bold text-gray-700">
            Email
          </label>
          <input
            className="border border-gray-300 px-3 py-2 rounded"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
        </div>

        <div className="flex items-end w-full md:w-1/4">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded h-fit w-full"
            type="submit"
          >
            + Add User
          </button>
        </div>
      </form>

      {error && <div className="text-red-600 mt-2">{error}</div>}
    </>
  );
};

export default UserForm;
