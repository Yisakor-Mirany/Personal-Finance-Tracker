import { useEffect, useState, useCallback } from "react";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api/client";
import TransactionTable from "../components/TransactionTable";
import TransactionForm from "../components/TransactionForm";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Modal state: null | "add" | "edit"
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);

  // Filter / search
  const [filter, setFilter] = useState({ search: "", type: "all" });

  const load = useCallback(() => {
    setLoading(true);
    fetchTransactions()
      .then(setTransactions)
      .catch(() => setError("Failed to load transactions."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setModal("add"); };
  const openEdit = (tx) => {
    setEditing({
      type: tx.type,
      amount: String(tx.amount),
      category_id: String(tx.category_id),
      description: tx.description ?? "",
      date: tx.date,
      _id: tx.id,
    });
    setModal("edit");
  };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (modal === "add") {
        await createTransaction(payload);
      } else {
        const { _id, ...rest } = payload;
        await updateTransaction(editing._id, rest);
      }
      closeModal();
      load();
    } catch {
      alert("Failed to save transaction. Check all fields and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      load();
    } catch {
      alert("Failed to delete transaction.");
    }
  };

  const filtered = transactions.filter((tx) => {
    const matchType = filter.type === "all" || tx.type === filter.type;
    const q = filter.search.toLowerCase();
    const matchSearch =
      !q ||
      (tx.description ?? "").toLowerCase().includes(q) ||
      tx.category.name.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">
            {transactions.length} total transaction{transactions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by description or category…"
          value={filter.search}
          onChange={(e) => setFilter((p) => ({ ...p, search: e.target.value }))}
          className="input max-w-xs"
        />
        <select
          value={filter.type}
          onChange={(e) => setFilter((p) => ({ ...p, type: e.target.value }))}
          className="input w-36"
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48 text-gray-400">
            <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : (
          <div className="p-1">
            <TransactionTable
              transactions={filtered}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {modal === "add" ? "Add Transaction" : "Edit Transaction"}
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={closeModal}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <TransactionForm
                initial={editing}
                onSubmit={handleSubmit}
                onCancel={closeModal}
                loading={submitting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
