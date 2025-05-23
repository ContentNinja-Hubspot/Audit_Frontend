import React, { useState, useEffect } from "react";
import { uploadPartnerData, fetchThemeDetails } from "../api";
import { useUser } from "../context/UserContext";
import { useNotify } from "../context/NotificationContext";

export default function PartnerRegistration() {
  const [themes, setThemes] = useState([]);
  const [fonts, setFonts] = useState([]);
  const [form, setForm] = useState({
    agency_name: "",
    agency_domain: "",
    logo: null,
    theme_id: "",
    font_id: "",
  });
  const [loading, setLoading] = useState(false);

  const { token } = useUser();
  const { success, error } = useNotify();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchThemeDetails(token);
        setThemes(data.themes || []);
        setFonts(data.fonts || []);
      } catch (err) {
        error("Unable to fetch themes and fonts.");
      }
    };
    fetchData();
  }, [token, error]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    setLoading(true);
    try {
      const response = await uploadPartnerData(formData, token);
      success("Form submitted! 🎉");
      setForm({
        agency_name: "",
        agency_domain: "",
        logo: null,
        theme_id: "",
        font_id: "",
      });
    } catch (err) {
      error(err?.message || "Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-20 px-4">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-12 text-gray-900 text-center">
        Partner Registration
      </h1>
      <form
        className="flex flex-col gap-6 sm:gap-7 w-full max-w-fit bg-transparent text-start"
        onSubmit={handleSubmit}
      >
        <FormRow label="Partner Agency Name" required>
          <input
            className="border-0 border-b-2 border-purple-200 focus:border-purple-400 outline-none bg-white px-2 py-2 w-full text-base transition"
            name="agency_name"
            type="text"
            value={form.agency_name}
            onChange={handleChange}
            required
          />
        </FormRow>
        <FormRow label="Partner Agency Domain" required>
          <input
            className="border-0 border-b-2 border-purple-200 focus:border-purple-400 outline-none bg-white px-2 py-2 w-full text-base transition"
            name="agency_domain"
            type="text"
            value={form.agency_domain}
            onChange={handleChange}
            required
          />
        </FormRow>
        <FormRow label="Logo (jpeg, png & jpg)">
          <input
            className="border-0 border-b-2 border-purple-200 focus:border-purple-400 outline-none bg-white px-2 py-2 w-full text-base transition file:text-purple-500 file:font-medium"
            name="logo"
            type="file"
            accept=".jpeg,.png,.jpg"
            onChange={handleChange}
          />
        </FormRow>
        <FormRow label="Theme">
          <select
            className="border-0 border-b-2 border-purple-200 focus:border-purple-400 outline-none bg-white px-2 py-2 w-full text-base transition"
            name="theme_id"
            value={form.theme_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a theme</option>
            {themes.map((theme) => (
              <option key={theme.theme_id} value={theme.theme_id}>
                {theme.theme_name}
              </option>
            ))}
          </select>
        </FormRow>

        <FormRow label="Font family">
          <select
            className="border-0 border-b-2 border-purple-200 focus:border-purple-400 outline-none bg-white px-2 py-2 w-full text-base transition"
            name="font_id"
            value={form.font_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a font</option>
            {fonts.map((font) => (
              <option key={font.font_id} value={font.font_id}>
                {font.font_name}
              </option>
            ))}
          </select>
        </FormRow>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`bg-white border-2 border-purple-400 text-purple-500 font-semibold text-lg py-2 px-8 transition hover:bg-purple-50 hover:border-purple-400 w-full sm:w-auto ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Label + input row (now stacks vertically on small screens)
function FormRow({ label, required, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2 sm:gap-0">
      <label className="w-full sm:text-base text-gray-800 font-normal mb-1 sm:mb-0">
        {label}
        {required && <span className="text-red-500 ml-1 w-60 ">*</span>}
      </label>
      <div className="w-full">{children}</div>
    </div>
  );
}
