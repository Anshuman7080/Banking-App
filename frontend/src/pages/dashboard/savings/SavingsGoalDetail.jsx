import { Link, useParams } from "react-router-dom";
import { DesktopSidebar, MobileSidebar } from "../../../layout/Sidebar";
import DashboardHeader from "../../../layout/DashboardHeader";
import { ArrowLeft, PiggyBank, PlusCircle, X, Wallet, DollarSign, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { savingGoalDetail, depostieToSavingGoal } from "../../../lib/operations/coreApis";
import toast from "react-hot-toast";

const SavingsGoalDetail = () => {

    console.log("coming in saving goal");
    const [amount, setAmount] = useState("");
    const [transaction_pin, setTransaction_pin] = useState("");
    const [depositing, setDepositing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const { uuid } = useParams();
    const token = useSelector((state) => state.auth.token);
    const [loading, setLoading] = useState(true);
    const [goalData, setGoalData] = useState(null);

    const fetchGoalDetail = async () => {
        setLoading(true);
        const res = await savingGoalDetail(token, uuid);
        if (res?.data) setGoalData(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchGoalDetail();
    }, [uuid, token]);

    const handleDeposit = async () => {
        if (!amount) {
            toast.error("Please enter an amount");
            return;
        }
        if (!transaction_pin) {
            toast.error("Please enter your transaction PIN");
            return;
        }

        try {
            setDepositing(true);
            const res = await depostieToSavingGoal(token, uuid, amount, transaction_pin);
            toast.success("Deposit successful");

            // Reset fields and close modal
            setAmount("");
            setTransaction_pin("");
            setModalOpen(false);

            // Refetch to get latest goal data
            fetchGoalDetail();

        } catch (error) {
            toast.error("Deposit failed, please try again");
        } finally {
            setDepositing(false);
        }
    };

    const goal = goalData?.goal;
    const transactions = goalData?.transactions || [];
    const wallet = goalData?.wallet;

    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased dark:bg-[#0a0a0a] dark:text-white">
            <div className="flex">
                <DesktopSidebar />
                <MobileSidebar />

                <div className="flex min-h-screen flex-1 flex-col">
                    <DashboardHeader />

                    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">

                        {/* Top bar */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Link to="/dashboard/savings" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </Link>
                            </div>

                            <button
                                onClick={() => setModalOpen(true)}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 dark:bg-white dark:text-black"
                            >
                                <PlusCircle className="h-4 w-4" /> Deposit
                            </button>

                            {/* Modal */}
                            {modalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                    {/* Backdrop */}
                                    <div className="absolute inset-0" onClick={() => !depositing && setModalOpen(false)} />

                                    <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#101113]">

                                        {/* Close button */}
                                        <button

                                            onClick={() => !depositing && setModalOpen(false)}
                                            className="absolute right-3 top-3 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm  dark:border-white/10 dark:bg-white/5 dark:text-white"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>

                                        <div className="mb-4 flex items-center gap-2">
                                            <div className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-black/40">
                                                <PiggyBank className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-semibold">
                                                    Deposit into "{goal?.name || "Goal"}"
                                                </h3>
                                                <p className="text-xs text-gray-600 dark:text-white/60">
                                                    Move money from your wallet to this goal.
                                                </p>
                                            </div>
                                        </div>
                                        

                                        <div className="mb-4 rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm dark:border-white/10 dark:bg-black/40">
                                            <div className="flex items-center gap-2 text-gray-700 dark:text-white/80">
                                                <Wallet className="h-4 w-4" />
                                                <span>Wallet balance:</span>
                                                <span className="font-semibold">₹{wallet?.balance ?? "0"}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="mb-1 block text-xs font-medium">Amount</label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full rounded-xl border px-9 py-2 text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-xs font-medium">Transaction PIN</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="password"
                                                        value={transaction_pin}
                                                        onChange={(e) => setTransaction_pin(e.target.value)}
                                                        placeholder="••••"
                                                        className="w-full rounded-xl border px-9 py-2 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex justify-end gap-2">
                                            <button
                                                onClick={() => !depositing && setModalOpen(false)}
                                                disabled={depositing}
                                                className="rounded-xl border px-4 py-2.5 text-sm disabled:opacity-60"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleDeposit}
                                                disabled={depositing}
                                                className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm text-white dark:bg-white dark:text-black disabled:opacity-60"
                                            >
                                                {depositing ? "Depositing..." : "Deposit"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Goal summary */}
                        <div className="rounded-2xl border p-6 shadow-sm">
                            <div className="flex justify-between">
                                <div>
                                    <h1 className="text-lg font-semibold">
                                        {loading ? "Loading goal details..." : goal?.name || "No Goal Found"}
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Target: ₹{goal?.target_amount ?? 0} • Saved: ₹{goal?.current_amount ?? 0}
                                    </p>
                                </div>
                                <PiggyBank className="h-6 w-6" />
                            </div>

                            <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
                                <div
                                    className="h-full bg-indigo-600"
                                    style={{ width: `${goal?.progress_percentage ?? 0}%` }}
                                />
                            </div>

                            <div className="mt-2 text-sm text-gray-600">
                                {goal?.progress_percentage ?? 0}% completed • Target date: {goal?.target_date || "N/A"}
                            </div>
                        </div>

                        {/* Transactions */}
                        <section className="mt-8">
                            <h2 className="mb-3 text-lg font-semibold">Goal Transactions</h2>

                            {transactions.length === 0 ? (
                                <div className="text-center text-gray-500 py-6">
                                    {loading ? "Loading transactions..." : "No transactions yet"}
                                </div>
                            ) : (
                                <table className="min-w-full text-sm border rounded-2xl">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Amount</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((tx, i) => (
                                            <tr key={i} className="border-t border-gray-100 dark:border-white/10">
                                                <td className="px-4 py-3">{new Date(tx.timestamp).toLocaleString()}</td>
                                                <td className="px-4 py-3">{tx?.kind}</td>
                                                <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">+ ₹{tx?.amount}</td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex rounded-full bg-black text-white px-2 py-0.5 text-xs font-medium">{tx?.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </section>

                    </main>
                </div>
            </div>
        </div>
    );
};

export default SavingsGoalDetail;