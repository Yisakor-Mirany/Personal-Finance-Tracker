import { useState, useEffect } from "react";
import { fetchCategories } from "../api/client";

const EMPTY = {
  type: "expense",
  amount: "",
  category_id: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function TransactionForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .finally(() => setCatLoading(false));
  }, []);

  // Keep form in sync when `initial` changes (edit mode)
  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      amount: parseFloat(form.amount),
      category_id: parseInt(form.category_id, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type toggle */}
      <div>
        <label className="label">Type</label>
        <div className="flex gap-2">
          {["expense", "income"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((p) => ({ ...p, type: t }))}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                form.type === t
                  ? t === "income"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-red-500 text-white border-red-500"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="label">
          Amount ($)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={form.amount}
          onChange={handleChange}
          className="input"
          placeholder="0.00"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category_id" className="label">
          Category
        </label>
        <select
          id="category_id"
          name="category_id"
          required
          value={form.category_id}
          onChange={handleChange}
          className="input"
          disabled={catLoading}
        >
          <option value="">Select a category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="label">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          value={form.date}
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="label">
          Description{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="description"
          name="description"
          type="text"
          maxLength={255}
          value={form.description}
          onChange={handleChange}
          className="input"
          placeholder="e.g. Weekly grocery run"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving…" : initial ? "Update" : "Add Transaction"}
        </button>
      </div>
    </form>
  );
}
