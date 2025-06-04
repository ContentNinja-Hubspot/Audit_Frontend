import React, { useState } from "react";
import { useAudit } from "../../context/ReportContext";

const UserForm = ({ onAddUser }) => {
  const [form, setForm] = useState({ email: "", name: "" });
  const [error, setError] = useState("");
  const { selectedHub } = useAudit();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.name) {
      setError("All fields are required.");
      return;
    }

    const payload = {
      ...form,
      hub_id: selectedHub?.hub_id,
    };

    onAddUser(payload);
    setForm({ email: "", name: "" });
    setError("");
  };

  return (
    <>
      <h2 className="text-lg text-start font-semibold mb-4">Add New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-gray-700">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button type="submit">+ Add User</button>
        </div>
      </form>

      {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
    </>
  );
};

export default UserForm;
