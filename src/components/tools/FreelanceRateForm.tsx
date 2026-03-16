"use client";

import { useState } from "react";
import { FreelanceResults } from "@/types";
import { formatCurrency, roundToNearest } from "@/lib/utils";
import GenerateButton from "@/components/shared/GenerateButton";

export default function FreelanceRateForm() {
  const [desiredIncome, setDesiredIncome] = useState<number>(0);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [vacationWeeks, setVacationWeeks] = useState<number>(2);
  const [businessExpenses, setBusinessExpenses] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(20);
  const [results, setResults] = useState<FreelanceResults | null>(null);

  const calculate = () => {
    const workableWeeks = 52 - vacationWeeks;
    const workableHours = workableWeeks * hoursPerWeek;
    const marginMultiplier = 1 - profitMargin / 100;
    const totalNeeded =
      marginMultiplier > 0
        ? (desiredIncome + businessExpenses) / marginMultiplier
        : desiredIncome + businessExpenses;
    const hourlyRate = workableHours > 0 ? totalNeeded / workableHours : 0;
    const roundedHourly = roundToNearest(hourlyRate, 5);

    const projectHours = [5, 10, 20, 40];
    const projectRates = projectHours.map((hours) => ({
      hours,
      rate: roundToNearest(roundedHourly * hours, 10),
    }));

    const monthlyBillableHours = workableHours / 12;

    setResults({
      hourlyRate: roundedHourly,
      projectRates,
      monthlyBillableHours: Math.round(monthlyBillableHours),
      totalNeeded: Math.round(totalNeeded),
    });
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Desired Annual Income ($)
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 80000"
              value={desiredIncome || ""}
              onChange={(e) =>
                setDesiredIncome(parseFloat(e.target.value) || 0)
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Working Hours per Week
            </label>
            <input
              type="number"
              min="1"
              max="80"
              value={hoursPerWeek || ""}
              onChange={(e) =>
                setHoursPerWeek(parseFloat(e.target.value) || 0)
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Weeks of Vacation per Year
            </label>
            <input
              type="number"
              min="0"
              max="52"
              value={vacationWeeks || ""}
              onChange={(e) =>
                setVacationWeeks(parseFloat(e.target.value) || 0)
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Annual Business Expenses ($)
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 5000"
              value={businessExpenses || ""}
              onChange={(e) =>
                setBusinessExpenses(parseFloat(e.target.value) || 0)
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Profit Margin Target (%)
            </label>
            <input
              type="number"
              min="0"
              max="90"
              value={profitMargin || ""}
              onChange={(e) =>
                setProfitMargin(parseFloat(e.target.value) || 0)
              }
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <GenerateButton onClick={calculate} text="Calculate Rate" />

      {results && (
        <div className="space-y-4 mt-6">
          {/* Main rate */}
          <div className="rounded-xl border-2 border-brand-200 bg-brand-50 p-4 sm:p-6 text-center">
            <p className="text-sm text-brand-700 mb-1">
              Your Recommended Hourly Rate
            </p>
            <p className="text-4xl font-bold text-brand-600">
              {formatCurrency(results.hourlyRate)}
              <span className="text-lg font-normal text-brand-500">/hr</span>
            </p>
          </div>

          {/* Project rates */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-surface-900 mb-4">
              Suggested Project Rates
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {results.projectRates.map((pr) => (
                <div
                  key={pr.hours}
                  className="text-center p-3 rounded-lg bg-surface-50"
                >
                  <p className="text-xs text-gray-500 mb-1">
                    {pr.hours}hr project
                  </p>
                  <p className="text-lg font-bold text-surface-900">
                    {formatCurrency(pr.rate)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">
                Monthly Billable Hours Needed
              </p>
              <p className="text-xl font-bold text-surface-900">
                {results.monthlyBillableHours}hrs
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">
                Total Annual Revenue Needed
              </p>
              <p className="text-xl font-bold text-surface-900">
                {formatCurrency(results.totalNeeded)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
