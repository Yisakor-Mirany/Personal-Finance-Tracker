import { format } from "date-fns";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <svg
          className="w-12 h-12 mx-auto mb-3 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0120 9.414V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Date
            </th>
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Description
            </th>
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Category
            </th>
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Type
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Amount
            </th>
            <th className="py-3 px-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-2 text-gray-500 whitespace-nowrap">
                {format(new Date(tx.date), "MMM d, yyyy")}
              </td>
              <td className="py-3 px-2 text-gray-800 max-w-[200px] truncate">
                {tx.description || "—"}
              </td>
              <td className="py-3 px-2">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs">
                  {tx.category.name}
                </span>
              </td>
              <td className="py-3 px-2">
                {tx.type === "income" ? (
                  <span className="badge-income">Income</span>
                ) : (
                  <span className="badge-expense">Expense</span>
                )}
              </td>
              <td
                className={`py-3 px-2 text-right font-semibold whitespace-nowrap ${
                  tx.type === "income" ? "text-green-600" : "text-red-500"
                }`}
              >
                {tx.type === "income" ? "+" : "-"}
                {fmt.format(Math.abs(tx.amount))}
              </td>
              <td className="py-3 px-2">
                <div className="flex items-center justify-end gap-1">
                  <button
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                    onClick={() => onEdit(tx)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                    onClick={() => onDelete(tx.id)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
