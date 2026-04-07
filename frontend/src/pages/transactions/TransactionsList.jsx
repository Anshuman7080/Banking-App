// src/pages/TransactionList.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, XCircle, Wallet as WalletIcon, Hash, CalendarClock, ChevronRight } from "lucide-react";
import DashboardHeader from "../../layout/DashboardHeader";
import { DesktopSidebar, MobileSidebar } from "../../layout/Sidebar";
import { transactionLists } from "../../lib/operations/coreApis";
import { useSelector } from "react-redux";
import apiClient from "../../lib/apiClient"; // ✅ make sure this import exists

const formatDate = (timestamp) => {
  return new Date(timestamp)
    .toLocaleString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [nextPage, setNextPage] = useState(null);  
  const [loading, setLoading] = useState(false); 

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const getTransactionList = async () => {
      setLoading(true);

      const res = await transactionLists(token);
      console.log("response of transaction list", res);

      if (res?.data) {
        setTransactions(res.data.results);   
        setNextPage(res.data.next);          
      }

      setLoading(false);
    };

    getTransactionList();
  }, []);


  const loadMoreTransactions = async () => {
    if (!nextPage) return;

    setLoading(true);

    const res = await apiClient(
      "GET",
      nextPage,
      {},
      {
        Authorization: `Bearer ${token}`,
      },
      null,
      true
    );

    if (res?.data) {
      setTransactions((prev) => [...prev, ...res.data.results]); // append
      setNextPage(res.data.next);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased dark:bg-[#0a0a0a] dark:text-white">
      <div className="flex">
        <DesktopSidebar />
        <MobileSidebar />

        <main className="min-h-screen flex-1">
          <DashboardHeader />

          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-6 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm  dark:border-white/10 dark:bg-white/5 dark:text-white">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <div className="hidden text-sm text-gray-500 dark:text-white/60 sm:block">/ Transactions</div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold">Transactions</h1>
                <p className="text-sm text-gray-600 dark:text-white/60">
                  Your recent deposits, transfers, withdrawals, and bills.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">

              {/* Mobile View */}
              <ul className="divide-y divide-gray-200 p-2 sm:hidden dark:divide-white/10">
                {transactions.length === 0 ? (
                  <li className="p-4 text-center text-sm text-gray-500 dark:text-white/60">
                    No transactions done yet
                  </li>
                ) : (
                  transactions?.map((tx,i) => (
                    <li key={i}>
                      <Link to={`/dashboard/transaction/${tx.reference}`}>
                        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5">
                          <div className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-black/40">
                            <WalletIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-semibold">{tx.transaction_type}</div>
                              <span className="inline-flex items-center gap-1.5 rounded-xl border px-2 py-0.5 text-[11px] font-semibold">
                                {tx.status}
                              </span>
                            </div>
                            <div className="mt-1 text-sm">${tx.amount}</div>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-white/60">
                              <span className="inline-flex items-center gap-1">
                                <Hash className="h-3.5 w-3.5" />
                                {tx.reference}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <CalendarClock className="h-3.5 w-3.5" />
                                {formatDate(tx.timestamp)}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="mt-1 h-4 w-4 text-gray-400 dark:text-white/50" />
                        </div>
                      </Link>
                    </li>
                  ))
                )}
              </ul>

              {/* Desktop View */}
              <div className="hidden sm:block">
                <table className="min-w-full table-fixed border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-600 dark:bg-black/40 dark:text-white/60">
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-500 dark:text-white/60">
                          No transactions done yet
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx,i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-black/40">
                                <WalletIcon className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-medium">{tx.transaction_type}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-semibold">${tx.amount}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 rounded-xl border px-2 py-0.5 text-[11px] font-semibold">
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs">{tx.reference}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm">{formatDate(tx.timestamp)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              to={`/dashboard/transaction/${tx.reference}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm  dark:border-white/10 dark:bg-transparent dark:text-white"
                            >
                              View
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ✅ Load More Button */}
            {nextPage && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={loadMoreTransactions}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 dark:border-white/10 dark:bg-black/40 dark:text-white/60">
              Click a transaction to view full details, copy references, and see ledger status.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransactionList;