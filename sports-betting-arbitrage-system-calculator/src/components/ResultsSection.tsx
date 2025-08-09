import React from "react";

interface ResultsSectionProps {
  darkMode: boolean;
  allValidAndFilled: boolean;
  parsed: any;
  totalStake: number;
  recommendedStakes: number[] | null;
  formatPercent: (x: number) => string;
  currency: (x: number) => string;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  darkMode,
  allValidAndFilled,
  parsed,
  totalStake,
  recommendedStakes,
  formatPercent,
  currency,
}) => (
  <section className={darkMode ? "card p-4 mb-4 bg-dark text-light border-secondary" : "card p-4 mb-4"}>
    <h2 className="h4 mb-3">Result</h2>
    {!allValidAndFilled ? (
      <p className={darkMode ? "text-white-50" : "text-secondary"}>Enter valid odds for at least two outcomes to see results.</p>
    ) : (
      <div className="mb-3">
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <div className={darkMode ? "d-flex justify-content-between align-items-center bg-secondary rounded p-2 mb-2" : "d-flex justify-content-between align-items-center bg-light rounded p-2 mb-2"}>
              <span>Sum of implied probabilities</span>
              <strong>{parsed.sumImplied !== undefined ? (parsed.sumImplied).toFixed(4) : "—"}</strong>
            </div>
          </div>
          <div className="col-md-6">
            <div className={darkMode ? "d-flex justify-content-between align-items-center bg-secondary rounded p-2 mb-2" : "d-flex justify-content-between align-items-center bg-light rounded p-2 mb-2"}>
              <span>Arbitrage exists?</span>
              <strong className={parsed.exists ? (darkMode ? "text-success-emphasis" : "text-success") : darkMode ? "text-light" : "text-dark"}>{parsed.exists ? "Yes" : "No"}</strong>
            </div>
          </div>
          <div className="col-md-6">
            <div className={darkMode ? "d-flex justify-content-between align-items-center bg-secondary rounded p-2 mb-2" : "d-flex justify-content-between align-items-center bg-light rounded p-2 mb-2"}>
              <span>Payout multiplier</span>
              <strong>{parsed.exists && parsed.payoutMultiplier ? parsed.payoutMultiplier.toFixed(4) : "NA"}</strong>
            </div>
          </div>
          <div className="col-md-6">
            <div className={darkMode ? "d-flex justify-content-between align-items-center bg-secondary rounded p-2 mb-2" : "d-flex justify-content-between align-items-center bg-light rounded p-2 mb-2"}>
              <span>Guaranteed Payout</span>
              <strong>{parsed.exists && parsed.payoutMultiplier ? currency(totalStake * parsed.payoutMultiplier) : "NA"}</strong>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className={darkMode ? "table table-bordered table-hover align-middle table-dark" : "table table-bordered table-hover align-middle"}>
            <thead className={darkMode ? "table-secondary" : "table-light"}>
              <tr>
                <th>Outcome</th>
                <th>Input odds</th>
                <th>Decimal</th>
                <th>Implied prob</th>
                <th>Stake Proportion</th>
                {isFinite(Number(totalStake)) && Number(totalStake) > 0 && <th>Stake $</th>}
              </tr>
            </thead>
            <tbody>
              {parsed.updated.map((b: any, i: number) => (
                <tr key={b.id}>
                  <td>{b.label?.trim() || `Bet ${i + 1}`}</td>
                  <td>{b.odds || "—"} <span className="text-muted small">({b.format})</span></td>
                  <td>{b.decimal ? b.decimal.toFixed(4) : "—"}</td>
                  <td>{b.decimal ? (1 / b.decimal).toFixed(4) : "—"}</td>
                  <td>{parsed.exists && parsed.proportions?.[i] !== undefined ? parsed.proportions[i].toFixed(4) : "NA"}</td>
                  {recommendedStakes && <td>{parsed.exists ? currency(recommendedStakes[i]) : "NA"}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!parsed.exists && (
          <div className={darkMode ? "alert alert-info mt-3 bg-secondary text-light border-0" : "alert alert-info mt-3"} role="alert">
            Tip: To have an arbitrage, the sum of implied probabilities must be less than 1. Try mixing books across the same bets.
          </div>
        )}
        {parsed.exists && (
          <div className={darkMode ? "alert alert-success mt-3 bg-success text-light border-0" : "alert alert-success mt-3"} role="alert">
            <strong>Arbitrage found!</strong><br />
            Stake according to the proportions above. Your payout is the same regardless of outcome.<br />
            <span className="fw-semibold">
              {parsed.payoutMultiplier?.toFixed(4)} × your total stake = {parsed.payoutMultiplier ? currency(totalStake * parsed.payoutMultiplier) : "—"}
            </span>
          </div>
        )}
      </div>
    )}
  </section>
);

export default ResultsSection;
