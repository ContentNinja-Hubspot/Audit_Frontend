import React, { useState } from "react";

export default function PartnerRegistration() {
  const [form, setForm] = useState({
    agencyName: "",
    agencyDomain: "",
    logo: null,
    primaryColor: "",
    secondaryColor: "",
    fontFamily: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    // Log the FormData body for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    alert("Form submitted!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-16">
      <h1 className="text-3xl font-semibold mb-12 text-gray-900">
        Partner Registration
      </h1>
      <form
        className="flex flex-col gap-7 min-w-[420px] bg-transparent text-start"
        onSubmit={handleSubmit}
      >
        <FormRow label="Partner Agency Name" required>
          <input
            className="border-0 border-b-2 border-purple-200 focus:border-purple-400 outline-none bg-white px-2 py-2 w-80 text-base transition"
            name="agencyName"
            type="text"
            value={form.agencyName}
            onChange={handleChange}
            required
          />
        </FormRow>
        <FormRow label="Partner Agency Domain" required>
          <input
            className="border-0 border-b-2 border-purple-200 focus:border-purple-400 outline-none bg-white px-2 py-2 w-80 text-base transition"
            name="agencyDomain"
            type="text"
            value={form.agencyDomain}
            onChange={handleChange}
          />
        </FormRow>
        <FormRow label="Logo (jpeg, png & jpg)">
          <input
            className="border-0 border-b-2 border-purple-200 focus:border-purple-400 outline-none bg-white px-2 py-2 w-80 text-base transition file:text-purple-500 file:font-medium"
            name="logo"
            type="file"
            accept=".jpeg,.png,.jpg"
            onChange={handleChange}
          />
        </FormRow>
        <FormRow label="Primary Color">
          <input
            className="border-0 border-b-2 border-purple-200 focus:border-purple-400 outline-none bg-white px-2 py-2 w-80 text-base transition"
            name="primaryColor"
            type="text"
            value={form.primaryColor}
            onChange={handleChange}
          />
        </FormRow>
        <FormRow label="Secondary Color">
          <input
            className="border-0 border-b-2 border-purple-200 focus:border-purple-400 outline-none bg-white px-2 py-2 w-80 text-base transition"
            name="secondaryColor"
            type="text"
            value={form.secondaryColor}
            onChange={handleChange}
          />
        </FormRow>
        <FormRow label="Font family">
          <input
            className="border-0 border-b-2 border-purple-200 focus:border-purple-400 outline-none bg-white px-2 py-2 w-80 text-base transition"
            name="fontFamily"
            type="text"
            value={form.fontFamily}
            onChange={handleChange}
          />
        </FormRow>
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="bg-white border-2 border-purple-400 text-purple-500 font-semibold text-lg py-2 px-8 transition hover:bg-purple-50 hover:border-purple-400"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

// Label + input row
function FormRow({ label, required, children }) {
  return (
    <div className="flex items-center justify-between">
      <label className="w-60 text-base text-gray-800 font-normal">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
