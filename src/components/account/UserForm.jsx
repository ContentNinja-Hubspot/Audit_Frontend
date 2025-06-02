import React, { useState } from "react";

const UserForm = ({ onAddUser }) => {
  const [form, setForm] = useState({ email: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email) {
      setError("Email is required.");
      return;
    }
    onAddUser(form);
    setForm({ email: "" });
    setError("");
  };

  return (
    <>
      <h2 className="text-lg text-start font-semibold mb-4">Add New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email input */}
        <div className="grid grid-cols-1 gap-4">
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

        {/* Submit button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
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
