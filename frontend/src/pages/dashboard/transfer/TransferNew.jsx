import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, CheckCircle2, User2, Wallet, Send, Shield, ArrowLeft } from "lucide-react";

import { DesktopSidebar, MobileSidebar } from "../../../layout/Sidebar";
import DashboardHeader from "../../../layout/DashboardHeader";
import { getBeneficiaries, verifyWalletId, transferFunds } from "../../../lib/operations/coreApis";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { clearOverview } from "../../../slices/overviewSlice";

const TransferNew = () => {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [wallet_id, setWallet_id] = useState("");
    const [raw_amount, setRaw_amount] = useState("");
    const [pin, setPin] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [sending, setSending] = useState(false);
    const dispatch = useDispatch();

    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const getBeneficiaryList = async () => {
            const res = await getBeneficiaries(token);
            setBeneficiaries(res.data);
        };
        getBeneficiaryList();
    }, []);

    const handleVerify = async () => {
        if (!wallet_id) {
            toast.error("Please enter a wallet ID");
            return;
        }
        try {
            setVerifying(true);
            const res = await verifyWalletId(token, wallet_id);
            if (res.status == 200) {
                setIsVerified(true);
                toast.success("Wallet verified successfully");
            }
        } catch (error) {
            toast.error("Invalid wallet ID");
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async () => {
        if (!isVerified) {
            toast.error("Please verify the wallet ID first");
            return;
        }
        if (!raw_amount || !pin) {
            toast.error("Amount and PIN are required");
            return;
        }
        try {
            setSending(true);
            const res = await transferFunds(token, wallet_id, pin, raw_amount);
            if(res.status===200){
                toast.success("Funds sent successfully");
            }else if (res.status===429){
                toast.error("You're doing that too much. Please wait and try again.")
            }
                dispatch(clearOverview());
             setWallet_id("");
            setRaw_amount("");
             setPin("");
             setIsVerified(false);
        } catch (error) {
            toast.error("Transfer failed, please try again");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased dark:bg-[#0a0a0a] dark:text-white">
            <div className="flex">
                <DesktopSidebar />
                <MobileSidebar />

                <main className="min-h-screen bg-white text-gray-900 dark:bg-[#0a0a0a] dark:text-white">
                    <DashboardHeader />

                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-6 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Link>
                            <div className="hidden text-sm text-gray-500 dark:text-white/60 sm:block">/ Transfers / New</div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                            {/* ===== Left: Beneficiaries ===== */}
                            <aside className="lg:col-span-4">
                                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                                    <div className="mb-3 flex items-center justify-between">
                                        <h2 className="text-sm font-semibold">Beneficiaries</h2>
                                        <Link to="/dashboard/beneficiaries" className="text-xs text-gray-700 underline-offset-4 hover:underline dark:text-white/80">
                                            Manage
                                        </Link>
                                    </div>

                                    <div className="mb-3">
                                        <label className="sr-only">Search</label>
                                        <div className="relative">
                                            <input type="text" placeholder="Search beneficiary" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 pl-9 text-sm text-gray-900 placeholder:text-gray-400 outline-none ring-0 transition focus:border-gray-400 dark:border-white/10 dark:bg-transparent dark:text-white dark:placeholder:text-white/50" />
                                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/50" />
                                        </div>
                                    </div>

                                    <ul className="divide-y divide-gray-200 dark:divide-white/10">
                                        {beneficiaries?.map((b) => (
                                            <li key={b.id} className="py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setWallet_id(b.wallet_id);
                                                        setIsVerified(false);
                                                    }}
                                                    className="group flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-white/5"
                                                >
                                                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-black/40">
                                                        <User2 className="h-5 w-5 text-gray-700 dark:text-white/80" />
                                                    </span>
                                                    <span className="flex-1">
                                                        <span className="block text-sm font-medium">{b?.name}</span>
                                                        <span className="block text-xs text-gray-600 dark:text-white/60">{b?.wallet_id}</span>
                                                    </span>
                                                    <span className="hidden rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-700 shadow-sm group-hover:inline-block dark:border-white/10 dark:bg-transparent dark:text-white">Use</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-3 text-xs text-gray-600 dark:border-white/10 dark:text-white/60">
                                        Tip: pick a beneficiary to auto-fill the wallet ID on the right.
                                    </div>
                                </div>
                            </aside>

                            {/* ===== Right: Transfer form ===== */}
                            <section className="lg:col-span-8">
                                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <h1 className="text-lg font-semibold">Send Funds</h1>
                                            <p className="text-sm text-gray-600 dark:text-white/60">Transfer to any wallet in seconds. Fees are shown before you confirm.</p>
                                        </div>
                                        <div className="hidden items-center gap-2 sm:flex">
                                            <span className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 dark:border-white/10 dark:bg-transparent dark:text-white">
                                                <Shield className="mr-1.5 h-3.5 w-3.5" /> Secure
                                            </span>
                                            <span className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 dark:border-white/10 dark:bg-transparent dark:text-white">
                                                <Wallet className="mr-1.5 h-3.5 w-3.5" /> Balance-friendly
                                            </span>
                                        </div>
                                    </div>

                                    {/* Wallet ID + Verify */}
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div className="sm:col-span-2">
                                            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-white/70">Recipient Wallet ID</label>
                                            <input
                                                type="text"
                                                onChange={(e) => {
                                                    setWallet_id(e.target.value);
                                                    setIsVerified(false);
                                                }}
                                                value={wallet_id}
                                                placeholder="e.g. 8842031169"
                                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none ring-0 transition focus:border-gray-400 dark:border-white/10 dark:bg-transparent dark:text-white dark:placeholder:text-white/50"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                onClick={handleVerify}
                                                disabled={verifying}
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-white/10 dark:bg-white dark:text-black disabled:opacity-60"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                                {verifying ? "Verifying..." : "Verify"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Verified badge */}
                                    {isVerified && (
                                        <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Wallet <span className="font-medium">{wallet_id}</span> verified successfully.
                                        </div>
                                    )}

                                    {/* Amount + PIN */}
                                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-white/70">Amount</label>
                                            <div className="relative">
                                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-white/60">$</span>
                                                <input
                                                    type="number"
                                                    value={raw_amount}
                                                    onChange={(e) => setRaw_amount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-7 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none ring-0 transition focus:border-gray-400 dark:border-white/10 dark:bg-transparent dark:text-white dark:placeholder:text-white/50"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-white/70">Transaction PIN</label>
                                            <input
                                                type="password"
                                                value={pin}
                                                onChange={(e) => setPin(e.target.value)}
                                                placeholder="••••"
                                                maxLength={4}
                                                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm tracking-widest text-gray-900 placeholder:text-gray-400 outline-none ring-0 transition focus:border-gray-400 dark:border-white/10 dark:bg-transparent dark:text-white dark:placeholder:text-white/50"
                                            />
                                        </div>
                                    </div>

                                    {/* Note */}
                                    <div className="mt-3">
                                        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-white/70">Note (optional)</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Say something nice…"
                                            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none ring-0 transition focus:border-gray-400 dark:border-white/10 dark:bg-transparent dark:text-white dark:placeholder:text-white/50"
                                        />
                                    </div>

                                    {/* Fee + Buttons */}
                                    <div className="mt-5 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                                        <div className="text-xs text-gray-600 dark:text-white/60">
                                            Estimated fee: <span className="font-medium">$0.00</span> · Arrival: instant
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                to="/dashboard"
                                                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/5"
                                            >
                                                Cancel
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={sending}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 dark:bg-white dark:text-black disabled:opacity-60"
                                            >
                                                <Send className="h-4 w-4" />
                                                {sending ? "Sending..." : "Send Funds"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 dark:border-white/10 dark:bg-black/40 dark:text-white/60">
                                    Transfers to non-beneficiaries may require additional checks. Ensure the wallet ID is correct. Funds sent are final.
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TransferNew;