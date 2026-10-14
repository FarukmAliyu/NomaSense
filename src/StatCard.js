import React from "react";

/*
  NomaSense stat card
  One component replacing both previous StatCard versions.
  Props:
    title      label, e.g. "Crop health"
    value      main figure, e.g. "94%"
    subtitle   optional small line under the value, e.g. "PHI score"
    icon       an icon element or a string such as an emoji
    color      accent color for the icon (default green)

  Example:
    <StatCard title="Healthy crops" value="94%" subtitle="PHI score" icon={<FaLeaf />} color="#15803d" />
*/

const css = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.nc {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}
.nc *, .nc *::before, .nc *::after { box-sizing: border-box; }
.nc p { margin: 0; }

.nc-icon {
  flex: none;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  font-size: 18px;
  background: #e5e7eb;
  background: color-mix(in srgb, var(--nc-color) 14%, #ffffff);
  color: var(--nc-color);
}
.nc-body { min-width: 0; }
.nc-title { font-size: 13px; font-weight: 500; color: #6b7280; }
.nc-value {
  margin-top: 2px;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: #111827;
  overflow-wrap: anywhere;
}
.nc-sub { margin-top: 1px; font-size: 13px; color: #6b7280; }
`;

function StatCard({ title, value, subtitle, icon, color = "#15803d" }) {
  return (
    <div className="nc" style={{ "--nc-color": color }}>
      <style>{css}</style>
      {icon && (
        <div className="nc-icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className="nc-body">
        <p className="nc-title">{title}</p>
        <p className="nc-value">{value}</p>
        {subtitle && <p className="nc-sub">{subtitle}</p>}
      </div>
    </div>
  );
}

export default StatCard;
