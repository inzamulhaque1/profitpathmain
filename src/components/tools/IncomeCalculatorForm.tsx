"use client";

import { useState } from "react";
import { IncomeSource, IncomeResults } from "@/types";
import { formatCurrency, formatPercent, generateId } from "@/lib/utils";
import GenerateButton from "@/components/shared/GenerateButton";

const createEmptySource = (): IncomeSource => ({
  id: generateId(),
  name: "",
  revenue: 0,
  expenses: 0,
});

export default function IncomeCalculatorForm() {
  const [sources, setSources] = useState<IncomeSource[]>([
    createEmptySource(),
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [results, setResults] = useState<IncomeResults | null>(null);

  const updateSource = (
    id: string,
    field: keyof Omit<IncomeSource, "id">,
    value: string | number
  ) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addSource = () => {
    setSources((prev) => [...prev, createEmptySource()]);
  };

  const removeSource = (id: string) => {
    if (sources.length > 1) {
      setSources((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const calculate = () => {
    const grossIncome = sources.reduce((sum, s) => sum + (s.revenue || 0), 0);
    const totalExpenses = sources.reduce(
      (sum, s) => sum + (s.expenses || 0),
      0
    );
    const netProfit = grossIncome - totalExpenses;
    const profitMargin = grossIncome > 0 ? (netProfit / grossIncome) * 100 : 0;
    const afterTax = netProfit * (1 - taxRate / 100);

    const sourceProfits = sources
      .filter((s) => s.name)
      .map((s) => {
        const profit = (s.revenue || 0) - (s.expenses || 0);
        return {
          name: s.name,
          profit,
          percentage: grossIncome > 0 ? ((s.revenue || 0) / grossIncome) * 100 : 0,
        };
      });

    const topEarner =
      sourceProfits.length > 0
        ? sourceProfits.reduce((top, s) =>
            s.profit > top.profit ? s : top
          )
        : null;

    setResults({
      grossIncome,
      totalExpenses,
      netProfit,
      profitMargin,
      afterTax,
      topEarner: topEarner
        ? { name: topEarner.name, percentage: topEarner.percentage }
        : null,
      sources: sourceProfits,
    });
  };

  return (
    <div className="space-y-6">
      {/* Income sources */}
      <div className="space-y-4">
        {sources.map((source, index) => (
          <div
            key={source.id}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-400">
                Source #{index + 1}
              </span>
              {sources.length > 1 && (
                <button
                  onClick={() => removeSource(source.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Freelance Design"
                  value={source.name}
                  onChange={(e) =>
                    updateSource(source.id, "name", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Monthly Revenue ($)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={source.revenue || ""}
                  onChange={(e) =>
                    updateSource(
                      source.id,
                      "revenue",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Monthly Expenses ($)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={source.expenses || ""}
                  onChange={(e) =>
                    updateSource(
                      source.id,
                      "expenses",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addSource}
        className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
      >
        + Add another income source
      </button>

      {/* Tax rate */}
      <div className="max-w-xs">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Tax Rate (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={taxRate || ""}
          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <GenerateButton onClick={calculate} text="Calculate Profit" />

      {/* Results */}
      {results && (
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                label: "Gross Income",
                value: formatCurrency(results.grossIncome),
                color: "text-surface-900",
              },
              {
                label: "Total Expenses",
                value: formatCurrency(results.totalExpenses),
                color: "text-red-500",
              },
              {
                label: "Net Profit",
                value: formatCurrency(results.netProfit),
                color:
                  results.netProfit >= 0 ? "text-brand-600" : "text-red-500",
              },
              {
                label: "Profit Margin",
                value: formatPercent(results.profitMargin),
                color: "text-surface-900",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-gray-200 bg-white p-4 text-center"
              >
                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {taxRate > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">
                After-Tax Income ({taxRate}%)
              </p>
              <p className="text-xl font-bold text-brand-600">
                {formatCurrency(results.afterTax)}
              </p>
            </div>
          )}

          {/* Breakdown bars */}
          {results.sources.length > 1 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-surface-900 mb-4">
                Income Breakdown
              </h3>
              <div className="space-y-3">
                {results.sources.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{s.name}</span>
                      <span className="font-medium text-surface-900">
                        {formatCurrency(s.profit)} (
                        {formatPercent(s.percentage)})
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(s.percentage, 2)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.topEarner && results.sources.length > 1 && (
            <p className="text-sm text-gray-500 bg-brand-50 rounded-lg p-3">
              Your top earner is{" "}
              <span className="font-semibold text-brand-700">
                {results.topEarner.name}
              </span>{" "}
              at {formatPercent(results.topEarner.percentage)} of total income.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
