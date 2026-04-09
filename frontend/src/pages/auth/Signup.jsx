import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../layout/Header";
import signup from "../../lib/operations/authApis";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    transaction_pin: "",
  });
  const [pinError, setPinError] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only digits and max 4 characters for transaction pin
    if (name === "transaction_pin") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 4) return;
      setPinError("");
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.transaction_pin.length !== 4) {
      setPinError("Transaction PIN must be exactly 4 digits.");
      return;
    }

    dispatch(signup(formData.email, formData.password, formData.transaction_pin, navigate));
    console.log("coming in handleSubmit");
  };

  return (
    <>
      <Header />

      <main className="relative grid min-h-screen place-items-center overflow-hidden bg-white p-4 text-gray-900 dark:bg-gradient-to-b dark:from-black dark:via-neutral-950 dark:to-black dark:text-white">
        {/* Ambient glow (dark mode only) */}
        <div className="pointer-events-none absolute inset-0 hidden dark:block">
          <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 h-64 w-64 translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 h-11 w-11 rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm dark:bg-white/10 dark:ring-white/15 dark:backdrop-blur">
              <div className="grid h-full w-full place-items-center">
                <span className="block h-2 w-2 rounded-full bg-gray-900 dark:bg-white/85" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">Join and get moving fast.</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-md">
            {/* Error slot */}
            <div className="hidden mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              Could not create account. Try a different email/username.
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">Email</label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 outline-none ring-0 transition focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-200 dark:border-white/10 dark:bg-black/40 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white/20 dark:focus:bg-black/30 dark:focus-visible:ring-white/10"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.password}
                    name="password"
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 placeholder:text-gray-400 outline-none ring-0 transition focus:border-gray-400 focus-visible:ring-2 focus-visible:ring-gray-200 dark:border-white/10 dark:bg-black/40 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white/20 dark:focus:bg-black/30 dark:focus-visible:ring-white/10"
                  />
                </div>
              </div>

              {/* Transaction PIN */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Transaction PIN
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="transaction_pin"
                    value={formData.transaction_pin}
                    onChange={handleChange}
                    placeholder="4-digit PIN"
                    inputMode="numeric"
                    maxLength={4}
                    className={`w-full rounded-xl border bg-white px-3 py-2 pr-10 text-gray-900 placeholder:text-gray-400 outline-none ring-0 transition focus-visible:ring-2 dark:bg-black/40 dark:text-white dark:placeholder:text-neutral-500 dark:focus:bg-black/30 dark:focus-visible:ring-white/10 ${
                      pinError
                        ? "border-red-400 focus:border-red-400 focus-visible:ring-red-200 dark:border-red-500/60 dark:focus:border-red-500/60"
                        : "border-gray-300 focus:border-gray-400 focus-visible:ring-gray-200 dark:border-white/10 dark:focus:border-white/20"
                    }`}
                  />
                  {/* PIN dot indicators */}
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`block h-1.5 w-1.5 rounded-full transition-colors ${
                          i < formData.transaction_pin.length
                            ? "bg-gray-700 dark:bg-white/80"
                            : "bg-gray-300 dark:bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {/* Inline validation error */}
                {pinError && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{pinError}</p>
                )}
                <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
                  Used to authorize transactions. Keep it secret.
                </p>
              </div>

              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-xl bg-gray-900 px-4 py-2.5 text-white transition hover:opacity-95 dark:bg-white dark:text-black"
              >
                <span className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-white via-neutral-200 to-white opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 dark:block" />
                Create account
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-neutral-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 underline underline-offset-4 hover:underline dark:text-white/90 dark:hover:text-white"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400 dark:text-neutral-500">
            One account. Session refresh via secure cookies.
          </p>
        </div>
      </main>
    </>
  );
};

export default Signup;