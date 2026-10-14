import React, { useState } from "react";
import {
  FaHome,
  FaLeaf,
  FaChartLine,
  FaCloudSun,
  FaRobot,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

/*
  NomaSense sidebar
  Drop-in replacement for the previous Sidebar component.
  Optional props:
    defaultActive  name of the menu item shown as current (default "Dashboard")
    onSelect(name) called when a menu item is clicked
    onLogout()     called when Logout is clicked
  Place it beside your page content in a flex row:
    <div style={{ display: "flex" }}><Sidebar /><main style={{ flex: 1 }}>...</main></div>
*/

const css = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.nb {
  position: sticky;
  top: 0;
  flex: none;
  width: 248px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px 14px;
  background: #0f2e1d;
  color: #d5e3da;
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}
.nb *, .nb *::before, .nb *::after { box-sizing: border-box; }

.nb-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 10px 22px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}
.nb-mark {
  flex: none;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #1f6b3d;
}

.nb-nav { flex: 1; }
.nb-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }

.nb-item {
  position: relative;
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  background: none;
  border: none;
  border-radius: 8px;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}
.nb-item svg { flex: none; font-size: 16px; opacity: 0.85; }
.nb-item:hover { background: rgba(255, 255, 255, 0.07); color: #fff; }
.nb-item[aria-current="page"] {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-weight: 600;
}
.nb-item[aria-current="page"] svg { opacity: 1; }
.nb-item[aria-current="page"]::before {
  content: "";
  position: absolute;
  left: -14px;
  top: 10px;
  bottom: 10px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: #4ade80;
}
.nb-item:focus-visible { outline: 2px solid #86efac; outline-offset: 1px; }

.nb-foot {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.nb-logout:hover { background: rgba(254, 202, 202, 0.12); color: #fecaca; }

/* Icon-only rail on narrower screens */
@media (max-width: 900px) {
  .nb { width: 72px; padding: 16px 12px; align-items: center; }
  .nb-brand { padding: 4px 0 18px; }
  .nb-brand-name, .nb-label {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }
  .nb-nav, .nb-foot { width: 100%; }
  .nb-item { justify-content: center; padding: 0; }
  .nb-item svg { font-size: 18px; }
  .nb-item[aria-current="page"]::before { left: -12px; }
}
@media (prefers-reduced-motion: reduce) {
  .nb-item { transition: none; }
}
`;

const menus = [
  { icon: <FaHome />, name: "Dashboard" },
  { icon: <FaLeaf />, name: "Disease Detection" },
  { icon: <FaChartLine />, name: "Analytics" },
  { icon: <FaCloudSun />, name: "Weather" },
  { icon: <FaRobot />, name: "AI Assistant" },
  { icon: <FaCog />, name: "Settings" }
];

const LeafMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M5 19c3-5 6-8 10-10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

function Sidebar({ defaultActive = "Dashboard", onSelect, onLogout }) {
  const [active, setActive] = useState(defaultActive);

  const handleSelect = (name) => {
    setActive(name);
    if (onSelect) onSelect(name);
  };

  return (
    <aside className="nb">
      <style>{css}</style>

      <div className="nb-brand">
        <span className="nb-mark"><LeafMark /></span>
        <span className="nb-brand-name">NomaSense</span>
      </div>

      <nav className="nb-nav" aria-label="Main">
        <ul className="nb-list">
          {menus.map((m) => (
            <li key={m.name}>
              <button
                type="button"
                className="nb-item"
                onClick={() => handleSelect(m.name)}
                aria-current={active === m.name ? "page" : undefined}
                title={m.name}
              >
                {m.icon}
                <span className="nb-label">{m.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nb-foot">
        <button
          type="button"
          className="nb-item nb-logout"
          onClick={onLogout}
          title="Log out"
        >
          <FaSignOutAlt />
          <span className="nb-label">Log out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
