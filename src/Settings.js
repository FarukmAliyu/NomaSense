import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaGlobe, FaCloudSun, FaSave, FaRobot } from "react-icons/fa";

/*
  NomaSense settings
  Drop-in replacement for the previous Settings component.
  Same settings and state shape. Saving still logs to the console;
  replace that with localStorage or your backend when ready.
*/

const css = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.nt {
  --brand: #14532d;
  --brand-hover: #104626;
  --ink: #111827;
  --body: #374151;
  --muted: #6b7280;
  --line: #e5e7eb;
  --page: #f9fafb;
  --surface: #ffffff;
  min-height: 100vh;
  background: var(--page);
  color: var(--body);
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}
.nt *, .nt *::before, .nt *::after { box-sizing: border-box; }
.nt h1, .nt h2, .nt p { margin: 0; }

/* ---------- Top bar ---------- */
.nt-bar { background: var(--surface); border-bottom: 1px solid var(--line); }
.nt-bar-inner { max-width: 760px; margin: 0 auto; padding: 16px 24px; }
.nt-bar h1 { font-size: 20px; font-weight: 600; letter-spacing: -0.015em; color: var(--ink); }
.nt-bar p { margin-top: 2px; font-size: 14px; color: var(--muted); }

/* ---------- Layout ---------- */
.nt-wrap {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  gap: 20px;
}
.nt-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
}
.nt-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--line);
}
.nt-head h2 { font-size: 16px; font-weight: 600; color: var(--ink); }
.nt-head svg { color: var(--brand); }

/* ---------- Rows ---------- */
.nt-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}
.nt-row:last-child { border-bottom: none; }
.nt-row.stacked { flex-direction: column; align-items: stretch; gap: 12px; }
.nt-text { min-width: 0; }
.nt-label { display: block; font-size: 15px; font-weight: 500; color: var(--ink); }
.nt-hint { display: block; margin-top: 2px; font-size: 13px; line-height: 1.45; color: var(--muted); }

.nt-control {
  height: 40px;
  min-width: 0;
  padding: 0 12px;
  font: inherit;
  font-size: 14px;
  color: var(--ink);
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.nt-control:hover { border-color: #9ca3af; }
.nt-control:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(20, 83, 45, 0.16);
}
select.nt-control {
  width: 200px;
  padding-right: 34px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%236b7280' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;
}
input.nt-control[type="text"] { width: 280px; }

/* ---------- Switch ---------- */
.nt-switch { position: relative; flex: none; width: 44px; height: 24px; }
.nt-switch input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}
.nt-track {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: #d1d5db;
  transition: background 0.15s;
  pointer-events: none;
}
.nt-track::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s;
}
.nt-switch input:checked + .nt-track { background: var(--brand); }
.nt-switch input:checked + .nt-track::after { transform: translateX(20px); }
.nt-switch input:focus-visible + .nt-track {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

/* ---------- Slider ---------- */
.nt-slider { display: flex; align-items: center; gap: 16px; }
.nt-slider input[type="range"] {
  flex: 1;
  min-width: 0;
  height: 24px;
  accent-color: var(--brand);
  cursor: pointer;
}
.nt-slider input[type="range"]:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
.nt-value {
  flex: none;
  min-width: 52px;
  padding: 4px 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--brand);
  background: #ecfdf3;
  border-radius: 999px;
}
.nt-scale { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); }

/* ---------- Save bar ---------- */
.nt-save {
  position: sticky;
  bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px 14px 20px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.1);
}
.nt-status { font-size: 14px; color: var(--muted); }
.nt-status.dirty { color: #92400e; font-weight: 500; }
.nt-status.done { color: #166534; font-weight: 500; }
.nt-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 20px;
  border: none;
  border-radius: 8px;
  background: var(--brand);
  color: #fff;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.nt-btn:hover:not(:disabled) { background: var(--brand-hover); }
.nt-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.nt-btn:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

/* ---------- Responsive ---------- */
@media (max-width: 640px) {
  .nt-bar-inner, .nt-wrap { padding: 16px; }
  .nt-row { flex-direction: column; align-items: stretch; gap: 10px; }
  .nt-row.toggle { flex-direction: row; align-items: center; }
  select.nt-control, input.nt-control[type="text"] { width: 100%; }
  .nt-save { bottom: 12px; padding: 12px 14px; }
  .nt-btn { padding: 0 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .nt-track, .nt-track::after, .nt-control, .nt-btn { transition: none; }
}
`;

const defaultSettings = {
  notifications: true,
  emailAlerts: true,
  language: "English",
  cropType: "Maize",
  location: "Lagos, Nigeria",
  units: "Metric (°C)",
  autoAnalysis: true,
  confidenceThreshold: 75
};

function Toggle({ id, label, hint, checked, onChange }) {
  return (
    <div className="nt-row toggle">
      <div className="nt-text">
        <label className="nt-label" htmlFor={id}>{label}</label>
        {hint && <span className="nt-hint" id={`${id}-hint`}>{hint}</span>}
      </div>
      <span className="nt-switch">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
        <span className="nt-track" aria-hidden="true" />
      </span>
    </div>
  );
}

function Field({ id, label, hint, children }) {
  return (
    <div className="nt-row">
      <div className="nt-text">
        <label className="nt-label" htmlFor={id}>{label}</label>
        {hint && <span className="nt-hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [savedSettings, setSavedSettings] = useState(defaultSettings);
  const [justSaved, setJustSaved] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const dirty = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setJustSaved(false);
  };

  const saveSettings = () => {
    console.log("Saved Settings:", settings);
    // You can later save to localStorage or backend
    setSavedSettings(settings);
    setJustSaved(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setJustSaved(false), 3000);
  };

  return (
    <div className="nt">
      <style>{css}</style>

      <header className="nt-bar">
        <div className="nt-bar-inner">
          <h1>Settings</h1>
          <p>Manage your language, notifications and analysis preferences.</p>
        </div>
      </header>

      <main className="nt-wrap">
        {/* General */}
        <section className="nt-card" aria-labelledby="nt-general">
          <div className="nt-head">
            <FaGlobe aria-hidden="true" />
            <h2 id="nt-general">General</h2>
          </div>

          <Field id="nt-language" label="Language">
            <select
              id="nt-language"
              className="nt-control"
              value={settings.language}
              onChange={(e) => handleChange("language", e.target.value)}
            >
              <option>English</option>
              <option>French</option>
              <option>Yoruba</option>
              <option>Hausa</option>
              <option>Igbo</option>
            </select>
          </Field>

          <Field id="nt-crop" label="Default crop type">
            <select
              id="nt-crop"
              className="nt-control"
              value={settings.cropType}
              onChange={(e) => handleChange("cropType", e.target.value)}
            >
              <option>Maize</option>
              <option>Tomato</option>
              <option>Cassava</option>
              <option>Beans</option>
              <option>Rice</option>
            </select>
          </Field>

          <Field id="nt-location" label="Location">
            <input
              id="nt-location"
              type="text"
              className="nt-control"
              value={settings.location}
              onChange={(e) => handleChange("location", e.target.value)}
              autoComplete="off"
            />
          </Field>
        </section>

        {/* Notifications */}
        <section className="nt-card" aria-labelledby="nt-notifications">
          <div className="nt-head">
            <FaBell aria-hidden="true" />
            <h2 id="nt-notifications">Notifications</h2>
          </div>

          <Toggle
            id="nt-alerts"
            label="Disease alerts"
            hint="Get notified when a disease is detected."
            checked={settings.notifications}
            onChange={(v) => handleChange("notifications", v)}
          />
          <Toggle
            id="nt-email"
            label="Email reports"
            hint="Receive summary reports by email."
            checked={settings.emailAlerts}
            onChange={(v) => handleChange("emailAlerts", v)}
          />
        </section>

        {/* AI */}
        <section className="nt-card" aria-labelledby="nt-ai">
          <div className="nt-head">
            <FaRobot aria-hidden="true" />
            <h2 id="nt-ai">AI analysis</h2>
          </div>

          <Toggle
            id="nt-auto"
            label="Auto analysis on upload"
            hint="Analyze photos as soon as you upload them."
            checked={settings.autoAnalysis}
            onChange={(v) => handleChange("autoAnalysis", v)}
          />

          <div className="nt-row stacked">
            <div className="nt-text">
              <label className="nt-label" htmlFor="nt-confidence">Minimum confidence threshold</label>
              <span className="nt-hint">Set how confident the model must be before reporting a result.</span>
            </div>
            <div className="nt-slider">
              <input
                id="nt-confidence"
                type="range"
                min="60"
                max="95"
                value={settings.confidenceThreshold}
                onChange={(e) => handleChange("confidenceThreshold", parseInt(e.target.value, 10))}
                aria-valuetext={`${settings.confidenceThreshold} percent`}
              />
              <output className="nt-value" htmlFor="nt-confidence">{settings.confidenceThreshold}%</output>
            </div>
            <div className="nt-scale" aria-hidden="true">
              <span>60%</span>
              <span>95%</span>
            </div>
          </div>
        </section>

        {/* Weather */}
        <section className="nt-card" aria-labelledby="nt-weather">
          <div className="nt-head">
            <FaCloudSun aria-hidden="true" />
            <h2 id="nt-weather">Weather integration</h2>
          </div>

          <Field id="nt-units" label="Weather units">
            <select
              id="nt-units"
              className="nt-control"
              value={settings.units}
              onChange={(e) => handleChange("units", e.target.value)}
            >
              <option>Metric (°C)</option>
              <option>Imperial (°F)</option>
            </select>
          </Field>
        </section>

        {/* Save */}
        <div className="nt-save">
          <p
            className={`nt-status ${justSaved ? "done" : dirty ? "dirty" : ""}`}
            role="status"
          >
            {justSaved
              ? "Settings saved."
              : dirty
              ? "You have unsaved changes."
              : "All changes saved."}
          </p>
          <button type="button" className="nt-btn" onClick={saveSettings} disabled={!dirty}>
            <FaSave aria-hidden="true" />
            Save settings
          </button>
        </div>
      </main>
    </div>
  );
}

export default Settings;
