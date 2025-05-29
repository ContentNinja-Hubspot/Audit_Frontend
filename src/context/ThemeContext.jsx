// src/context/ThemeContext.js

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

  // Inject CSS variables globally
  const applyCSSVariables = (theme) => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-secondary", theme.secondary);
    root.style.setProperty("--color-tertiary", theme.tertiary);
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const response = await fetchPartnerThemeAndLogo(token);

        if (response.success) {
          const id = response?.theme_id || "default";
          const selectedTheme = THEME_COLORS[id] || DEFAULT_THEME;

          setThemeId(id);
          setLogoPath(response.logo_path);
          setColors(selectedTheme);
          applyCSSVariables(selectedTheme);
        } else {
          setColors(DEFAULT_THEME);
          applyCSSVariables(DEFAULT_THEME);
          setError(response.error || "Theme not found.");
        }
      } catch (err) {
        setColors(DEFAULT_THEME);
        applyCSSVariables(DEFAULT_THEME);
        setError("Theme fetch failed.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadTheme();
    } else {
      setColors(DEFAULT_THEME);
      applyCSSVariables(DEFAULT_THEME);
      setLoading(false);
    }
  }, [token]);

  return (
    <ThemeContext.Provider
      value={{ themeId, colors, logoPath, loading, error }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
