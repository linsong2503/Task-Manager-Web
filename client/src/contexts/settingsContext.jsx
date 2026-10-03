import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const SETTINGS_KEY = "task_settings";

const defaultSettings = {
  theme: "light",
  defaultPriority: "medium",
  defaultSort: "dueDate",
};

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const savedSettings =
      localStorage.getItem(SETTINGS_KEY);

    if (savedSettings) {
      try {
        return {
          ...defaultSettings,
          ...JSON.parse(savedSettings),
        };
      } catch {
        return defaultSettings;
      }
    }

    return defaultSettings;
  });

  const updateSetting = (key, value) => {
    setSettings((prev) => {
      const updatedSettings = {
        ...prev,
        [key]: value,
      };

      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(updatedSettings),
      );

      return updatedSettings;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(defaultSettings),
    );
  };

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      settings.theme === "dark",
    );
  }, [settings.theme]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        defaultSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = () => {
  return useContext(SettingsContext);
};

export default useSettings;