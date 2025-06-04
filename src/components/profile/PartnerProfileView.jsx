import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function PartnerProfileView({ partnerDetails, onEdit }) {
  const themeHex = partnerDetails.theme_hex || "#ccc";
  const { themeId } = useTheme();
  const themeName = partnerDetails.theme_name || partnerDetails.theme_id;

  const fontName = partnerDetails.font_name || partnerDetails.font_id;

  return (
    <div className="p-4 text-start bg-white rounded-2xl relative">
      <button
        onClick={onEdit}
        className={`absolute top-4 right-4 px-4 py-2 text-sm font-medium rounded-lg transition`}
      >
        ✏️ Edit Information
      </button>

      <h2 className="text-2xl font-extrabold mb-6 text-gray-900">My Profile</h2>

      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-black">
            Partner Agency Name
          </p>
          <p className="bg-gray-50 p-3 rounded-md mt-1 text-black">
            {partnerDetails.agency_name}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-black">
            Partner Agency Domain
          </p>
          <p className="bg-gray-50 p-3 rounded-md mt-1 text-black">
            {partnerDetails.agency_domain}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-black">Logo</p>
          <div className="bg-gray-50 p-3 rounded-md mt-1 flex items-center gap-4">
            <img
              src={partnerDetails.logo_path}
              alt="Agency Logo"
              className="w-12 h-12 object-contain border rounded-md"
            />
            <span className="text-black text-sm">
              {partnerDetails.logo_path?.split("/").pop()}
            </span>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-black">Theme</p>
          <div className="bg-gray-50 p-3 rounded-md mt-1 flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full border"
              style={{ backgroundColor: themeHex }}
            />
            <span className="text-black">{themeName}</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-black">Font Family</p>
          <p
            className="bg-gray-50 p-3 rounded-md mt-1 text-black"
            style={{ fontFamily: fontName }}
          >
            {fontName}
          </p>
        </div>
      </div>
    </div>
  );
}
