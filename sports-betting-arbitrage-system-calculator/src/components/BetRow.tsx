import React from "react";

interface BetRowProps {
  index: number;
  bet: any;
  onChange: (bet: any) => void;
  onRemove: () => void;
  canRemove: boolean;
  darkMode: boolean;
}

const BetRow: React.FC<BetRowProps> = ({ index, bet, onChange, onRemove, canRemove, darkMode }) => (
  <div className={darkMode ? "card mb-3 bg-dark text-light border-secondary" : "card mb-3"}>
    <div className={darkMode ? "card-body bg-dark text-light" : "card-body"}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="card-title mb-0">Bet {index + 1}</h5>
        {canRemove && (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={onRemove}
          >
            Remove
          </button>
        )}
      </div>
      <div className="row g-2">
        <div className="col-md-4">
          <label className={darkMode ? "form-label text-light" : "form-label"}>Odds</label>
          <input
            type="text"
            inputMode={bet.format === "decimal" ? "decimal" : "text"}
            pattern={bet.format === "american" ? "^-?\\d*$" : undefined}
            className={darkMode ? "form-control bg-dark text-light border-secondary placeholder-white-50" : "form-control"}
            placeholder={bet.format === "decimal" ? "e.g., 1.87" : bet.format === "american" ? "+150 or -120" : "e.g., 5/2"}
            value={bet.odds}
            onChange={(e) => onChange({ ...bet, odds: e.target.value })}
          />
        </div>
        <div className="col-md-4">
          <label className={darkMode ? "form-label text-light" : "form-label"}>Format</label>
          <select
            className={darkMode ? "form-select bg-dark text-light border-secondary" : "form-select"}
            value={bet.format}
            onChange={(e) => onChange({ ...bet, format: e.target.value })}
          >
            <option value="decimal">Decimal</option>
            <option value="american">American</option>
            <option value="fractional">Fractional</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className={darkMode ? "form-label text-light" : "form-label"}>(Optional) Label</label>
          <input
            type="text"
            className={darkMode ? "form-control bg-dark text-light border-secondary placeholder-white-50" : "form-control"}
            placeholder="e.g., Home, Away, Team A"
            value={bet.label}
            onChange={(e) => onChange({ ...bet, label: e.target.value })}
          />
        </div>
      </div>
      {bet.error && (
        <div className="alert alert-danger mt-2 py-1 px-2 mb-0" role="alert" style={{ fontSize: '0.9em' }}>{bet.error}</div>
      )}
    </div>
  </div>
);

export default BetRow;
