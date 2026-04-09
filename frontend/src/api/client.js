import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ── Transactions ──────────────────────────────────────────────────────────────
export const fetchTransactions = () => api.get("/transactions").then((r) => r.data);

export const createTransaction = (payload) =>
  api.post("/transactions", payload).then((r) => r.data);

export const updateTransaction = (id, payload) =>
  api.put(`/transactions/${id}`, payload).then((r) => r.data);

export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

// ── Summary ───────────────────────────────────────────────────────────────────
export const fetchSummary = () => api.get("/summary").then((r) => r.data);

// ── Categories ────────────────────────────────────────────────────────────────
export const fetchCategories = () => api.get("/categories").then((r) => r.data);
