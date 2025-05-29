import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchPartnerThemeAndLogo } from "../api";
import { THEME_COLORS, DEFAULT_THEME } from "../config/theme.config";
import { useUser } from "./UserContext";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(null);
  const [logoPath, setLogoPath] = useState(null);
  const [colors, setColors] = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useUser();

  const applyCSSVariables = (theme) => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-secondary", theme.secondary);
    root.style.setProperty("--color-tertiary", theme.tertiary);
  };

  const updateTheme = (newThemeId) => {
    const selectedTheme = THEME_COLORS[newThemeId] || DEFAULT_THEME;
    setThemeId(newThemeId);
    setColors(selectedTheme);
    applyCSSVariables(selectedTheme);
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const response = await fetchPartnerThemeAndLogo(token);

        console.log("Theme fetch response:", response);

        if (response.success) {
          const id = response?.theme_id || "default";
          const fontName =
            response?.font_name?.replace(" (Default)", "") || "Lexend";
          console.log("Font name:", fontName);
          document.documentElement.style.setProperty(
            "--app-font-family",
            `'${fontName}', sans-serif`
          );
          updateTheme(id);
          setLogoPath(response.logo_path);
        } else {
          updateTheme("default");
          setError(response.error || "Theme not found.");
        }
      } catch (err) {
        updateTheme("default");
        setError("Theme fetch failed.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadTheme();
    } else {
      updateTheme("default");
      setLoading(false);
    }
  }, [token]);

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        colors,
        logoPath,
        loading,
        error,
        setThemeId,
        updateTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
