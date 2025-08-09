import React from "react";

interface FooterProps {
  darkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ darkMode }) => (
  <footer className={darkMode ? "text-white-50 small mt-4" : "text-muted small mt-4"}>
    <p>
      Notes: Odds must correspond to mutually exclusive, collectively exhaustive outcomes.
      Decimal odds &gt; 1.00. American odds cannot be 0. Fractional odds A/B require B &gt; 0.
    </p>
  </footer>
);

export default Footer;
