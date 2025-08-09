
import './App.css';
import React, { useMemo, useState, useEffect } from "react";
import Header from "./components/Header";
import BetRow from "./components/BetRow";
import ResultsSection from "./components/ResultsSection";
import Footer from "./components/Footer";


// Arbitrage Odds Calculator
// - Enter odds for mutually exclusive outcomes
// - Supports Decimal, American, and Fractional odds formats
// - Computes implied probabilities and checks for arbitrage opportunities
// - Displays recommended stakes based on total bankroll

function parseDecimalFromInput(input: string, format: string) {
  const trimmed = String(input || "").trim();
  if (!trimmed) return { ok: false, reason: "Empty" };

  // Detect if user typed a recognizable odds even if format dropdown is wrong.
  // Priority: explicit format setting, then auto-detect simple patterns.
  const f = format;

  try {
    if (f === "decimal") {
      const val = Number(trimmed);
      if (!isFinite(val)) return { ok: false, reason: "Not a number" };
      if (val <= 1) return { ok: false, reason: "Decimal odds must be > 1.00" };
      return { ok: true, value: val };
    }

    if (f === "american") {
      // Allow +150, 150, -200
      const n = Number(trimmed.replace(/^\+/, ""));
      if (!isFinite(n) || n === 0) return { ok: false, reason: "Invalid American odds" };
      const dec = n > 0 ? 1 + n / 100 : 1 + 100 / Math.abs(n);
      if (dec <= 1) return { ok: false, reason: "Invalid American odds" };
      return { ok: true, value: dec };
    }

    if (f === "fractional") {
      // Accept forms like 5/2, 1/1, 11/10
      const m = trimmed.match(/^\s*(-?\d+)\s*\/\s*(\d+)\s*$/);
      if (!m) return { ok: false, reason: "Use A/B format (e.g., 5/2)" };
      const a = Number(m[1]);
      const b = Number(m[2]);
      if (!isFinite(a) || !isFinite(b) || b <= 0) return { ok: false, reason: "Invalid fraction" };
      const dec = 1 + a / b;
      if (dec <= 1) return { ok: false, reason: "Fraction too small" };
      return { ok: true, value: dec };
    }
  } catch (e) {
    return { ok: false, reason: "Parse error" };
  }

  return { ok: false, reason: "Unknown format" };
}

function impliedFromDecimal(decimal: number) {
  return 1 / decimal; // implied probability
}

function formatPercent(x: number) {
  if (!isFinite(x)) return "—";
  return (x * 100).toFixed(2) + "%";
}

function currency(x: number) {
  if (!isFinite(x)) return "—";
  return x.toLocaleString(undefined, { style: "currency", currency: "USD" });
}



function App() {
  const [bets, setBets] = useState([
    { id: 1, label: "", odds: "", format: "decimal", error: "" },
  ]);
  const [totalStake, setTotalStake] = useState(100);
  const [darkMode, setDarkMode] = useState(false);

  // Apply theme to the whole page (body)
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-dark", "text-light");
      document.body.classList.remove("bg-light", "text-dark");
    } else {
      document.body.classList.add("bg-light", "text-dark");
      document.body.classList.remove("bg-dark", "text-light");
    }
  }, [darkMode]);

  const parsed = useMemo(() => {
    // Parse each bet to decimal odds; attach errors inline
    const updated = bets.map((b) => {
      const r = parseDecimalFromInput(b.odds, b.format);
      if (!b.odds) return { ...b, decimal: undefined, error: "" };
      if (r.ok) return { ...b, decimal: r.value, error: "" };
      return { ...b, decimal: undefined, error: r.reason };
    });

    // Compute metrics if at least 2 valid bets
    const validDecimals = updated
      .map((b) => b.decimal)
      .filter((x): x is number => typeof x === "number" && isFinite(x));

    let sumImplied: number | undefined = undefined;
    let payoutMultiplier = undefined;
    let exists = false;
    let proportions: number[] = [];

    if (validDecimals.length >= 2 && validDecimals.length === updated.filter(b => b.odds && !b.error).length) {
      sumImplied = validDecimals.reduce((acc, d) => acc + impliedFromDecimal(d), 0);
      payoutMultiplier = 1 / sumImplied;
      exists = sumImplied < 1;
      const weights = typeof sumImplied === "number" && isFinite(sumImplied) && sumImplied !== 0
        ? validDecimals.map((d) => (1 / d) / (sumImplied ?? 1))
        : [];
      proportions = weights;
    }

    return { updated, sumImplied, payoutMultiplier, exists, proportions };
  }, [bets]);

  const handleBetChange = (idx: number, next: any) => {
    setBets((prev) => prev.map((b, i) => (i === idx ? next : b)));
  };

  const addBet = () => {
    setBets((prev) => [
      ...prev,
      { id: prev.length + 1, label: "", odds: "", format: prev[prev.length - 1]?.format || "decimal", error: "" },
    ]);
  };

  const removeBet = (idx: number) => {
    setBets((prev) => prev.filter((_, i) => i !== idx));
  };

  const resetAll = () => {
    setBets([{ id: 1, label: "", odds: "", format: "decimal", error: "" }]);
  };

  const allValidAndFilled = parsed.updated.every((b) => b.odds && !b.error && b.decimal);

  const recommendedStakes = useMemo(() => {
    if (!allValidAndFilled || !parsed.proportions?.length || !isFinite(totalStake)) return null;
    const tot = Number(totalStake);
    if (!isFinite(tot) || tot <= 0) return null;
    const dollars = parsed.proportions.map((w) => Math.max(0, Math.round((w * tot) * 100) / 100));
    const sum = dollars.reduce((a, b) => a + b, 0);
    // adjust last to make exact total if rounding caused drift
    if (dollars.length > 0 && isFinite(sum) && sum !== tot) {
      const diff = Math.round((tot - sum) * 100) / 100;
      dollars[dollars.length - 1] = Math.round((dollars[dollars.length - 1] + diff) * 100) / 100;
    }
    return dollars;
  }, [parsed.proportions, totalStake, allValidAndFilled]);

  return (
    <div className="min-vh-100">
      <div className="container py-4">
        <div className="mx-auto" style={{ maxWidth: 800 }}>
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* INPUT AREA */}
          <section className="mb-4">
            {parsed.updated.map((bet, idx) => (
              <BetRow
                key={bet.id}
                index={idx}
                bet={bet}
                onChange={(next) => handleBetChange(idx, next)}
                onRemove={() => removeBet(idx)}
                canRemove={parsed.updated.length > 1}
                darkMode={darkMode}
              />
            ))}

            <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
              <button
                type="button"
                onClick={addBet}
                className="btn btn-primary me-2 mb-2"
              >
                Add Bet
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="btn btn-outline-secondary mb-2"
              >
                Reset
              </button>

              <div className="ms-auto d-flex align-items-center gap-2 mb-2">
                <label className="form-label mb-0 me-2">Total stake ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={totalStake}
                  onChange={(e) => setTotalStake(Number(e.target.value))}
                  className={darkMode ? "form-control bg-dark text-light border-secondary" : "form-control"}
                  style={{ width: 120 }}
                />
              </div>
            </div>
          </section>

          {/* RESULTS AREA */}
          <ResultsSection
            darkMode={darkMode}
            allValidAndFilled={allValidAndFilled}
            parsed={parsed}
            totalStake={totalStake}
            recommendedStakes={recommendedStakes}
            formatPercent={formatPercent}
            currency={currency}
          />

          {/* FOOTER / NOTES */}
          <Footer darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}


export default App
