import React, { useState, useEffect } from "react";
import { uploadPartnerData, fetchThemeDetails, checkUserType } from "../api";
import { useUser } from "../context/UserContext";
import { useNotify } from "../context/NotificationContext";

// Just a boring settings form for non-partners
function NormalSettingsForm({ form, handleChange, handleSubmit, loading }) {
  return (
    <form
      className="flex flex-col gap-6 sm:gap-7 w-full max-w-fit bg-transparent text-start"
      onSubmit={handleSubmit}
    >
      <FormRow label="Your Name" required>
        <input
          className="border-0 border-b-2 border-purple-200 focus:border-purple-400 outline-none bg-white px-2 py-2 w-full text-base transition"
          name="name"
          type="text"
          value={form.name || ""}
          onChange={handleChange}
          required
        />
      </FormRow>
      <FormRow label="Your Email" required>
        <input
          className="border-0 border-b-2 border-purple-200 focus:border-purple-400 outline-none bg-white px-2 py-2 w-full text-base transition"
          name="email"
          type="email"
          value={form.email || ""}
          onChange={handleChange}
          required
        />
      </FormRow>
      <div className="mt-8 flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className={`bg-white border-2 border-purple-400 text-purple-500 font-semibold text-lg py-2 px-8 transition hover:bg-purple-50 hover:border-purple-400 w-full sm:w-auto ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

export default function PartnerRegistration() {
  const [themes, setThemes] = useState([]);
  const [fonts, setFonts] = useState([]);
  const [userType, setUserType] = useState(null); // "partner" or "normal"
  const [form, setForm] = useState({
    agency_name: "",
    agency_domain: "",
    logo: null,
    theme_id: "",
    font_id: "",
    // For non-partner users
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const { token } = useUser();
  const { success, error } = useNotify();

  // Find out who we're dealing with
  useEffect(() => {
    const checkType = async () => {
      try {
        const { user_type } = await checkUserType(token); // returns { user_type: "partner" | "normal" }
        setUserType(user_type);
        // If partner, fetch themes/fonts for their form
        if (user_type === "partner") {
          const data = await fetchThemeDetails(token);
          setThemes(data.themes || []);
          setFonts(data.fonts || []);
        }
      } catch (err) {
        error("Could not check user type. You're probably normal. Sorry.");
        setUserType("normal");
      }
    };
    checkType();
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
    setLoading(true);

    // Decide what to submit based on user type
    if (userType === "partner") {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        // Only partner fields
        if (
          [
            "agency_name",
            "agency_domain",
            "logo",
            "theme_id",
            "font_id",
          ].includes(key) &&
          value
        ) {
          formData.append(key, value);
        }
      });

      try {
        await uploadPartnerData(formData, token);
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
    } else {
      // Non-partner (normal) form submission
      try {
        // Call your "save settings" API here if you have one
        // await saveUserSettings({ name: form.name, email: form.email }, token);
        success("Settings saved. You did it.");
        setForm((prev) => ({ ...prev, name: "", email: "" }));
      } catch (err) {
        error("Settings update failed. Life is pain.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Loading or still figuring out who this is
  if (!userType) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-20 px-4">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-12 text-gray-900 text-center">
        {userType === "partner" ? "Partner Registration" : "Your Settings"}
      </h1>
      {userType === "partner" ? (
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
      ) : (
        <NormalSettingsForm
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      )}
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
