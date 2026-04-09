import { useEffect, useState } from "react";
import { fetchSummary } from "../api/client";
import StatCard from "../components/StatCard";
import CategoryChart from "../components/CategoryChart";
import MonthlySummaryChart from "../components/MonthlySummaryChart";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function WalletIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}
function ArrowUpIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
    </svg>
  );
}
function ArrowDownIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
    </svg>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary()
      .then(setSummary)
      .catch(() => setError("Failed to load summary. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  const currentMonth = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your finances</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Balance"
          value={fmt.format(summary.balance)}
          icon={<WalletIcon />}
          color="blue"
          subtitle="All time"
        />
        <StatCard
          title="Total Income"
          value={fmt.format(summary.total_income)}
          icon={<ArrowUpIcon />}
          color="green"
          subtitle="All time"
        />
        <StatCard
          title="Total Expenses"
          value={fmt.format(summary.total_expenses)}
          icon={<ArrowDownIcon />}
          color="red"
          subtitle="All time"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Expenses by Category
            <span className="ml-2 text-xs font-normal text-gray-400">
              {currentMonth}
            </span>
          </h2>
          <CategoryChart data={summary.expenses_by_category} />
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Monthly Income vs Expenses
          </h2>
          <MonthlySummaryChart data={summary.monthly_summary} />
        </div>
      </div>
    </div>
  );
}
