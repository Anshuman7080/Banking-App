import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Wallet, UserRound } from "lucide-react";
import DashboardHeader from "../../../layout/DashboardHeader";
import { DesktopSidebar, MobileSidebar } from "../../../layout/Sidebar";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { verifyWalletFunding } from "../../../lib/operations/coreApis";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { clearOverview } from "../../../slices/overviewSlice";

const STRIPE_PUBLISHED_KEY = import.meta.env.VITE_STRIPE_PUBLISHED_KEY;
const stripePromise = loadStripe(STRIPE_PUBLISHED_KEY);

function FundForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [amount, setAmount] = useState("");
    const [cardholderName, setCardholderName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();

    const token = useSelector((state) => state.auth.token);

    async function handleFund() {
        if (!stripe || !elements) {
            toast.error("Stripe is not ready yet, try again in a second");
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        const card = elements.getElement(CardElement);
        if (!card) {
            toast.error("Card field is not ready");
            return;
        }

        setSubmitting(true);

        try {
            const pmResult = await stripe.createPaymentMethod({
                type: "card",
                card,
                billing_details: {
                    name: cardholderName || undefined,
                },
            });

            if (pmResult.error || !pmResult.paymentMethod) {
                toast.error(pmResult.error.message || "Could not create a payment method");
                return;
            }

            const paymentId = pmResult.paymentMethod.id;

            const { data } = await verifyWalletFunding({
                paymentId,
                amount: parsedAmount,
                token,
            });

            toast.success(data?.message || "Wallet funded successfully");
             dispatch(clearOverview());
           

            // Reset to initial state
            setAmount("");
            setCardholderName("");
            card.clear();

        } catch (error) {
            const resp = error?.response?.data;
            toast.error(resp?.error || "Funding failed, please try again later");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="mb-5">
                <h1 className="text-lg font-semibold">Fund Wallet</h1>
                <p className="text-sm text-gray-600 dark:text-white/60">Add money to your wallet securely.</p>
            </div>

            <form className="space-y-6" noValidate onSubmit={(e) => e.preventDefault()}>
                {/* Amount */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-white/70">Amount</label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-white/60">$</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="w-full rounded-xl border border-gray-300 bg-white px-7 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 dark:border-white/10 dark:bg-transparent dark:text-white"
                        />
                    </div>
                </div>

                {/* Cardholder name */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-white/70">Cardholder name</label>
                    <div className="relative">
                        <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/50" />
                        <input
                            type="text"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            placeholder="Jane Doe"
                            className="w-full rounded-xl border border-gray-300 bg-white px-9 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 dark:border-white/10 dark:bg-transparent dark:text-white dark:placeholder:text-white/50"
                        />
                    </div>
                </div>

                {/* Card details */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-white/70">Card details</label>
                    <div className="rounded-xl border border-gray-300 px-3 py-2 dark:border-white/10">
                        <CardElement
                            options={{
                                hidePostalCode: true,
                                style: {
                                    base: {
                                        fontSize: "14px",
                                        "::placeholder": { color: "#9ca3af" },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="text-xs text-gray-600 dark:text-white/60">
                        Your payment is processed securely via Stripe.
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/5"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            onClick={handleFund}
                            disabled={submitting || !stripe || !elements}
                            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 dark:bg-white dark:text-black disabled:opacity-60"
                        >
                            {submitting ? "Processing..." : "Fund Wallet"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

const FundWallet = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased dark:bg-[#0a0a0a] dark:text-white">
            <div className="flex">
                <DesktopSidebar />
                <MobileSidebar />

                <main className="min-h-screen flex-1">
                    <DashboardHeader />

                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-6 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Link>
                            <div className="hidden text-sm text-gray-500 dark:text-white/60 sm:block">/ Wallet / Fund</div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                            {/* Left: tips */}
                            <aside className="lg:col-span-4">
                                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-black/40">
                                            <Wallet className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold">Fund your wallet</div>
                                            <div className="text-xs text-gray-600 dark:text-white/60">Top up instantly with your card.</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-3 text-xs text-gray-600 dark:border-white/10 dark:text-white/60">
                                        <ul className="list-inside list-disc space-y-1">
                                            <li>Enter the amount you want to add.</li>
                                            <li>Use a valid card number, expiry, and CVV.</li>
                                            <li>We'll show fees during checkout.</li>
                                        </ul>
                                    </div>
                                </div>
                            </aside>

                            {/* Right: form */}
                            <section className="lg:col-span-8">
                                <Elements stripe={stripePromise} options={{}}>
                                    <FundForm />
                                </Elements>

                                <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 dark:border-white/10 dark:bg-black/40 dark:text-white/60">
                                    Card data is encrypted and processed securely via Stripe. We never store your card details.
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FundWallet;