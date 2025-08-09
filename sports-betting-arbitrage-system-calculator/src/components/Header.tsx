
import React from "react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => (
  <header className="mb-4">
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
      <div className="text-center text-md-start w-100">
        <h1 className="display-5 fw-bold mb-2">Arbitrage Odds Calculator</h1>
        <p className={darkMode ? "text-white-50" : "text-secondary"}>
          Enter odds for each mutually exclusive outcome. Supports Decimal, American, and Fractional odds formats.
        </p>
      </div>
      <div className="mt-3 mt-md-0 ms-md-4">
        <div className="form-check form-switch d-flex align-items-center justify-content-center justify-content-md-end">
          <input
            className="form-check-input"
            type="checkbox"
            id="darkModeSwitch"
            checked={darkMode}
            onChange={() => setDarkMode((d) => !d)}
            style={{ cursor: "pointer" }}
          />
          <label className="form-check-label ms-2" htmlFor="darkModeSwitch">
            {darkMode ? "Dark Mode" : "Light Mode"}
          </label>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
