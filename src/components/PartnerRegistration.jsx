import React, { useState, useEffect } from "react";
import { uploadPartnerData, fetchThemeDetails, checkUserType } from "../api";
import { useUser } from "../context/UserContext";
import { useNotify } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import CropModal from "./utils/CropModal";

function NormalSettingsForm({ form, handleChange, handleSubmit, loading }) {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <FormRow label="Your Name" required>
        <input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          required
          className="input-field"
        />
      </FormRow>
      <FormRow label="Your Email" required>
        <input
          name="email"
          type="email"
          value={form.email || ""}
          onChange={handleChange}
          required
          className="input-field"
        />
      </FormRow>
      <SubmitButton loading={loading} text="Save" />
    </form>
  );
}

export default function PartnerRegistration() {
  const [themes, setThemes] = useState([]);
  const [fonts, setFonts] = useState([]);
  const [userType, setUserType] = useState(null);
  const [form, setForm] = useState({
    agency_name: "",
    agency_domain: "",
    logo: null,
    theme_id: "",
    font_id: "",
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const { token } = useUser();
  const { success, error } = useNotify();

  const navigate = useNavigate();

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImageURL, setCroppedImageURL] = useState(null);

  useEffect(() => {
    const checkType = async () => {
      try {
        const { user_type } = await checkUserType(token);
        setUserType(user_type);
        if (user_type === "partner") {
          const data = await fetchThemeDetails(token);
          setThemes(data.themes || []);
          const sortedFonts = (data.fonts || []).sort((a, b) => {
            if (a.font_name === "Lexend (Default)") return -1;
            if (b.font_name === "Lexend (Default)") return 1;
            return 0;
          });
          setFonts(sortedFonts);
        }
      } catch {
        error("Could not check user type.");
        setUserType("normal");
      }
    };
    checkType();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo" && files && files[0]) {
      const imageURL = URL.createObjectURL(files[0]);
      setSelectedImage(imageURL);
      setCropModalOpen(true);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (userType === "partner") {
      const formData = new FormData();
      ["agency_name", "agency_domain", "logo", "theme_id", "font_id"].forEach(
        (key) => {
          if (form[key]) formData.append(key, form[key]);
        }
      );

      try {
        await uploadPartnerData(formData, token);
        success("Form submitted! 🎉");
        setForm({
          agency_name: "",
          agency_domain: "",
          logo: null,
          theme_id: "",
          font_id: "",
          name: "",
          email: "",
        });
        setCroppedImageURL(null);
      } catch (err) {
        error(err?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        success("Settings saved.");
        setForm((f) => ({ ...f, name: "", email: "" }));
      } catch {
        error("Settings update failed.");
      } finally {
        setLoading(false);
      }
    }
    navigate("/dashboard");
  };

  if (!userType) {
    return <div className="text-center mt-20 text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex mt-10 items-start justify-center">
      <div className="bg-white w-full max-w-3xl p-4 px-10 rounded-2xl shadow-md">
        <h1 className="text-xl font-semibold mb-4 text-center text-gray-900">
          {userType === "partner" ? "Partner Registration" : "Your Settings"}
        </h1>

        {userType === "partner" ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormRow label="Partner Agency Name" required>
              <input
                name="agency_name"
                value={form.agency_name}
                onChange={handleChange}
                required
                placeholder="Enter agency name"
                className="input-field"
              />
            </FormRow>

            <FormRow label="Partner Agency Domain" required>
              <input
                name="agency_domain"
                value={form.agency_domain}
                onChange={handleChange}
                required
                placeholder="Enter agency domain (e.g., example.com)"
                className="input-field"
              />
            </FormRow>

            <FormRow label="Logo (jpeg, png, & jpg)">
              <div className="w-full">
                <label
                  htmlFor="logo-upload"
                  className="flex flex-col items-center gap-2 border border-dashed border-gray-300 rounded-lg px-4 py-4 cursor-pointer hover:border-purple-500 transition"
                >
                  {croppedImageURL ? (
                    <img
                      src={croppedImageURL}
                      alt="Preview"
                      className="w-24 h-24 object-contain"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 hover:text-purple-600 transition"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  )}
                  <span className="text-gray-600 font-medium">
                    {form.logo?.name || "Click to upload"}
                  </span>
                </label>

                <input
                  id="logo-upload"
                  name="logo"
                  type="file"
                  accept=".jpeg,.png,.jpg"
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
            </FormRow>

            <FormRow label="Theme">
              <div className="flex gap-3 mt-1">
                {themes.map((theme) => (
                  <button
                    key={theme.theme_id}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        theme_id: theme.theme_id,
                      }))
                    }
                    className={`w-8 h-8 rounded-full border-2 ${
                      form.theme_id === theme.theme_id
                        ? "border-purple-500"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: theme.hex }}
                  />
                ))}
              </div>
            </FormRow>

            <FormRow label="Font Family">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fonts.map((font) => (
                  <div
                    key={font.font_id}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        font_id: font.font_id,
                      }))
                    }
                    className={`border p-3 rounded-lg cursor-pointer transition ${
                      form.font_id === font.font_id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-semibold">{font.font_name}</p>
                    <p
                      className="text-sm text-gray-500"
                      style={{ fontFamily: font.font_name }}
                    >
                      {font.description || "Custom font style."}
                    </p>
                  </div>
                ))}
              </div>
            </FormRow>

            <SubmitButton loading={loading} text="Submit" />
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

      {cropModalOpen && selectedImage && (
        <CropModal
          imageSrc={selectedImage}
          onClose={() => {
            setCropModalOpen(false);
            URL.revokeObjectURL(selectedImage);
            setSelectedImage(null);
          }}
          onCropComplete={(blob) => {
            const croppedFile = new File([blob], "cropped-logo.jpg", {
              type: "image/jpeg",
            });
            const previewURL = URL.createObjectURL(blob);
            setForm((prev) => ({ ...prev, logo: croppedFile }));
            setCroppedImageURL(previewURL);
            setCropModalOpen(false);
            URL.revokeObjectURL(selectedImage);
          }}
        />
      )}
    </div>
  );
}

function FormRow({ label, required, children }) {
  return (
    <div>
      <label className="block text-gray-600 text-sm font-semibold mb-1 text-start">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function SubmitButton({ loading, text }) {
  return (
    <div className="flex justify-center">
      <button
        type="submit"
        disabled={loading}
        className={`bg-purple-500 text-white font-medium text-lg py-2 px-8 rounded-md transition hover:bg-purple-600 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Processing..." : text}
      </button>
    </div>
  );
}
