import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, Wallet as WalletIcon, Send, Shield, Users, Bell, Settings, ChartBarBig, ArrowRight, Loader2 } from "lucide-react";
import ThemeToggleButton from "../../components/ThemeToggleButton";
import DashboardHeader from "../../layout/DashboardHeader";
import { DesktopSidebar, MobileSidebar, SidebarTrigger } from "../../layout/Sidebar";
import { getOverview, withdrawFromSavingGoal } from "../../lib/operations/coreApis";
import { useDispatch, useSelector } from "react-redux";
import { setOverview, clearOverview } from "../../slices/overviewSlice";
import toast from "react-hot-toast";

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

const Overview = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const cachedData = useSelector((state) => state.overview.data);
    const hasFetched = useRef(false);
    const [withdrawingGoalId, setWithdrawingGoalId] = useState(null);

    const fetchOverview = async () => {
        const toastId = toast.loading("Fetching data. Please wait...");
        try {
            const res = await getOverview(token);
            dispatch(setOverview(res.data));
        } catch (error) {
            console.log("error in getting overview detail", error);
            toast.error("Failed to load overview. Please refresh.");
        } finally {
            toast.dismiss(toastId);
        }
    };

    useEffect(() => {
        if (cachedData || hasFetched.current) return;
        hasFetched.current = true;
        fetchOverview();
    }, []);

    const handleWithdraw = async (goalId) => {
        try {
            setWithdrawingGoalId(goalId);

            const res = await withdrawFromSavingGoal(token, goalId);

            if (res.status === 200) {
                toast.success("Withdrawal successful!");
                dispatch(clearOverview());
                hasFetched.current = false;
                await fetchOverview();
            } else {
                toast.error("Withdrawal failed. Please try again.");
            }
        } catch (error) {
            console.log("error in withdrawing from goal", error);
            toast.error(error?.response?.data?.detail || "Error withdrawing. Please try again.");
        } finally {
            setWithdrawingGoalId(null);
        }
    };

    const balance = cachedData?.wallet?.balance || 0;
    const unread = cachedData?.unread_notifications || 0;
    const beneficiaries = cachedData?.beneficiaries || 0;
    const recent = cachedData?.recent_transactions || [];
    const goals = cachedData?.saving_goals || [];

    const progress = (g) => Math.min(100, Math.round((g.current / g.target) * 100));

    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased dark:bg-[#0a0a0a] dark:text-white">

            {/* ✅ FIX 1 */}
            <div className="flex min-h-screen bg-white dark:bg-[#0a0a0a]">

                <DesktopSidebar />
                <MobileSidebar />

                {/* ✅ FIX 2 */}
                <div className="flex min-h-screen flex-1 flex-col bg-white dark:bg-[#0a0a0a]">

                    <DashboardHeader />

                    {/* ✅ FIX 3 */}
                    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 bg-white dark:bg-[#0a0a0a]">

                        {/* Top summary cards */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-white/60">Wallet Balance</div>
                                        <div className="mt-2 text-3xl font-semibold">${balance.toLocaleString()}</div>
                                        <div className="mt-2 inline-flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> +3.1% this month
                                        </div>
                                    </div>
                                    <div className="grid h-11 w-11 place-items-center rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-black/40">
                                        <WalletIcon className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Link to="/dashboard/transfers/new" className="rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95 dark:bg-white dark:text-black">
                                        Transfer
                                    </Link>
                                    <Link to="/dashboard/fund" className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 hover:bg-gray-50 dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/5">
                                        Fund
                                    </Link>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-white/60">Savings Goals</div>
                                        <div className="mt-2 text-3xl font-semibold">{goals?.length}</div>
                                        <div className="mt-2 text-xs text-gray-600 dark:text-white/60">Track progress & automate deposits</div>
                                    </div>
                                    <div className="grid h-11 w-11 place-items-center rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-black/40">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link to="/dashboard/savings/new" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-900 underline-offset-4 hover:underline dark:text-white">
                                        Create goal <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-white/60">Beneficiaries</div>
                                        <div className="mt-2 text-3xl font-semibold">{beneficiaries}</div>
                                        <div className="mt-2 text-xs text-gray-600 dark:text-white/60">{unread} unread notifications</div>
                                    </div>
                                    <div className="grid h-11 w-11 place-items-center rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-black/40">
                                        <Users className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                   
                          <section className="mt-8">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Your Saving Goals</h2>
                                <Link to="/dashboard/savings" className="text-sm text-gray-900 underline-offset-4 hover:underline dark:text-white">
                                    View all
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                {goals?.map((g) => (
                                    <div key={g.uuid} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-sm text-gray-600 dark:text-white/60">Goal</div>
                                                <div className="mt-1 font-medium">{g.name}</div>
                                            </div>
                                            <div className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-black/40">
                                                <ChartBarBig className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                                            <div className="h-full rounded-full bg-gray-900 dark:bg-white" style={{ width: `${progress(g)}%` }} />
                                        </div>
                                        <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-white/60">
                                            <span>${g.current.toLocaleString()} saved</span>
                                            <span>Target ${g.target.toLocaleString()}</span>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            {/* ✅ Per-goal loading state */}
                                            <button
                                                onClick={() => handleWithdraw(g.uuid)}
                                                disabled={withdrawingGoalId === g.uuid}
                                                type="button"
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/5"
                                            >
                                                {withdrawingGoalId === g.uuid ? (
                                                    <>
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                        Withdrawing...
                                                    </>
                                                ) : (
                                                    "Withdraw"
                                                )}
                                            </button>
                                            <Link
                                                to={`/dashboard/savings/${g.uuid}`}
                                                className="rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95 dark:bg-white dark:text-black"
                                            >
                                                Deposit
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Recent transactions */}
                        <section className="mt-8">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                                <Link to="/dashboard/transactions" className="text-sm text-gray-900 underline-offset-4 hover:underline dark:text-white">
                                    View all
                                </Link>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
                                <table className="min-w-full text-sm">
                                    <thead className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500 dark:border-white/10 dark:text-white/60">
                                        <tr>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Counterparty</th>
                                            <th className="px-4 py-3">Amount</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recent?.map((t, i) => (
                                            <tr key={i} className="border-t border-gray-100 dark:border-white/10">
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center gap-2">
                                                        <span className={`h-1.5 w-1.5 rounded-full ${t.transaction_type === "DEPOSIT" ? "bg-emerald-500/90" : t.transaction_type === "TRANSFER" ? "bg-indigo-500/90" : t.transaction_type === "WITHDRAWAL" ? "bg-rose-500/90" : t.transaction_type === "SAVINGS" ? "bg-amber-500/90" : "bg-gray-500/90"}`} />
                                                        {t.transaction_type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">{t?.receiver?.username ?? "—"}</td>
                                                <td className="px-4 py-3 font-medium">
                                                    {t.type === "DEPOSIT" || t.type === "SAVINGS" ? "+" : "-"}${t.amount.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${t.status === "SUCCESSFUL" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : t.status === "PENDING" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-rose-500/15 text-rose-600 dark:text-rose-400"}`}>
                                                        {t.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-white/60">
                                                    {formatDate(t.timestamp)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Final CTA row */}
                        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
                            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                                <div className="text-sm text-gray-600 dark:text-white/60">Send money fast</div>
                                <div className="mt-2 text-lg font-semibold">Transfer</div>
                                <Link to="/dashboard/transfers/new" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 underline-offset-4 hover:underline dark:text-white">
                                    Start transfer <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                                <div className="text-sm text-gray-600 dark:text-white/60">Save automatically</div>
                                <div className="mt-2 text-lg font-semibold">Create Goal</div>
                                <Link to="/dashboard/savings/new" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 underline-offset-4 hover:underline dark:text-white">
                                    New goal <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                                <div className="text-sm text-gray-600 dark:text-white/60">Fuel your account</div>
                                <div className="mt-2 text-lg font-semibold">Fund Wallet</div>
                                <Link to="/dashboard/fund" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 underline-offset-4 hover:underline dark:text-white">
                                    Add funds <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </section>
                        
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Overview;