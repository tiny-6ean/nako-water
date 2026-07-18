const SETTINGS_KEY = "settings";
const CATS_KEY = "cats";
const LOG_KEY = "logs";

/* ------------------------------
   設定（飲水源・蒸発補正・単位）
------------------------------ */
export function loadSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);

  if (!raw) {
    // 初期設定（単位対応）
    const defaultSettings = {
      version: 1,
      sources: [
        { name: "水", evap: 0, unit: "g" },
        { name: "ウェット", evap: 5, unit: "g" }
      ]
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  return JSON.parse(raw);
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

/* ------------------------------
   猫
------------------------------ */
export function loadCats() {
  return JSON.parse(localStorage.getItem(CATS_KEY) || "[]");
}

export function saveCats(cats) {
  localStorage.setItem(CATS_KEY, JSON.stringify(cats));
}

/* ------------------------------
   記録ログ
------------------------------ */
export function loadLog() {
  return JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
}

export function saveLog(logs) {
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
}
