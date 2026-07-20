export function loadSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);

  if (!raw) {
    const emptySettings = {
      version: 2,
      spots: [],
      wetProducts: []
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(emptySettings));
    return emptySettings;
  }

  const settings = JSON.parse(raw);

  if (!settings.version || settings.version < 2) {
    settings.version = 2;
    saveSettings(settings);
  }

  if (!Array.isArray(settings.spots)) settings.spots = [];
  if (!Array.isArray(settings.wetProducts)) settings.wetProducts = [];

  return settings;
}
