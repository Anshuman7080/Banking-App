import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User2, Calendar, IdCard, UploadCloud, ShieldCheck, Info, Loader2 } from "lucide-react";
import DashboardHeader from "../../../layout/DashboardHeader";
import { DesktopSidebar, MobileSidebar } from "../../../layout/Sidebar";
import { UploadImageFile, UploadKycDetail } from "../../../lib/operations/userApis";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const INITIAL_FORM = {
    full_name: "",
    date_of_birth: "",
    id_type: "NATIONAL_ID",
    id_image: "",
};

const KYC = () => {
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [formDetail, setFormDetail] = useState(INITIAL_FORM);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = useSelector((state) => state.auth.token);

    const handleFileChange = async (e) => {
        const image = e.target.files[0];
        if (!image) return;

        setImageFile(image);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", image);

            const response = await UploadImageFile(formData);
            setImageUrl(response);
            setFormDetail((prev) => ({ ...prev, id_image: response }));
            toast.success("Image uploaded successfully!");
        } catch (err) {
            console.log(err);
            toast.error("Image upload failed. Please try again.");
            setImageFile(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = (e) => {
        setFormDetail({ ...formDetail, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormDetail(INITIAL_FORM);
        setImageFile(null);
        setImageUrl("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const kycResponse = await UploadKycDetail(
                formDetail.full_name,
                formDetail.date_of_birth,
                formDetail.id_type,
                formDetail.id_image,
                token
            );

            if (kycResponse?.status === 200 || kycResponse?.status === 201) {
                toast.success("KYC submitted! We'll review it within 24–72 hours.");
                resetForm();
            } else {
                toast.error("Submission failed. Please check your details and try again.");
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid =
        formDetail.full_name.trim() &&
        formDetail.date_of_birth &&
        formDetail.id_type &&
        formDetail.id_image;

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
                            <div className="hidden text-sm text-gray-500 dark:text-white/60 sm:block">/ Settings / KYC</div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            {/* Left: guidance / status */}
                            <aside className="lg:col-span-4">
                                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-black/40">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold">KYC Verification</div>
                                            <div className="text-xs text-gray-600 dark:text-white/60">
                                                Status: <span className="font-medium text-amber-600 dark:text-amber-400">Unverified</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-3 text-xs text-gray-600 dark:border-white/10 dark:text-white/60">
                                        <p>Submit your legal name, date of birth, ID type, and a photo/scan of your ID.</p>
                                        <ul className="mt-2 list-inside list-disc space-y-1">
                                            <li>Name must match your government ID.</li>
                                            <li>Date of birth must be in the past.</li>
                                            <li>Accepted IDs: National ID, Driver's License, Passport.</li>
                                            <li>Image should be clear, full document, no glare.</li>
                                        </ul>
                                    </div>

                                    <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 dark:border-white/10 dark:bg-black/40 dark:text-white/80">
                                        <div className="flex items-start gap-2">
                                            <Info className="mt-0.5 h-4 w-4" />
                                            <p>
                                                By submitting, you consent to verification and secure storage of KYC metadata. Your verification status will show as <strong>Pending Review</strong> until approved.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            {/* Right: form */}
                            <section className="lg:col-span-8">
                                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                                    <div className="mb-5">
                                        <h1 className="text-lg font-semibold">Submit your KYC</h1>
                                        <p className="text-sm text-gray-600 dark:text-white/60">This helps us keep your account safe and compliant.</p>
                                    </div>

                                    <form className="space-y-5" onSubmit={handleSubmit}>
                                        {/* Full name */}
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-white/70">Full name</label>
                                            <div className="relative">
                                                <User2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/50" />
                                                <input
                                                    type="text"
                                                    onChange={handleChange}
                                                    name="full_name"
                                                    value={formDetail.full_name}
                                                    placeholder="As shown on your ID"
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-9 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none ring-0 transition focus:border-gray-400 dark:border-white/10 dark:bg-transparent dark:text-white dark:placeholder:text-white/50"
                                                />
                                            </div>
                                        </div>

                                        {/* Date of birth */}
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-white/70">Date of birth</label>
                                            <div className="relative">
                                                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/50" />
                                                <input
                                                    type="date"
                                                    name="date_of_birth"
                                                    onChange={handleChange}
                                                    value={formDetail.date_of_birth}
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-9 py-2 text-sm text-gray-900 outline-none ring-0 transition focus:border-gray-400 dark:border-white/10 dark:bg-transparent dark:text-white"
                                                />
                                            </div>
                                        </div>

                                        {/* ID type */}
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-white/70">ID type</label>
                                            <div className="relative">
                                                <IdCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/50" />
                                                <select
                                                    onChange={handleChange}
                                                    name="id_type"
                                                    value={formDetail.id_type}
                                                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-9 py-2 text-sm text-gray-900 outline-none ring-0 transition focus:border-gray-400 dark:border-white/10 dark:bg-transparent dark:text-white"
                                                >
                                                    <option value="NATIONAL_ID">National ID Card</option>
                                                    <option value="DRIVERS_LICENSE">Driver's License</option>
                                                    <option value="PASSPORT">International Passport</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* ID image upload */}
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-white/70">ID image URL</label>
                                                <input
                                                    type="url"
                                                    placeholder="https://…"
                                                    value={imageUrl}
                                                    readOnly
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none ring-0 transition focus:border-gray-400 dark:border-white/10 dark:bg-transparent dark:text-white dark:placeholder:text-white/50"
                                                />
                                                <p className="mt-1 text-[11px] text-gray-500 dark:text-white/60">Auto-filled after upload.</p>
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-white/70">Upload ID image</label>
                                                <div className="flex items-center gap-3">
                                                    {/* ✅ Disabled while uploading */}
                                                    <label className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/5 ${isUploading ? "pointer-events-none opacity-60" : ""}`}>
                                                        {isUploading ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                <span>Uploading...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UploadCloud className="h-4 w-4" />
                                                                <span>Choose file</span>
                                                            </>
                                                        )}
                                                        <input
                                                            type="file"
                                                            onChange={handleFileChange}
                                                            accept="image/*"
                                                            className="hidden"
                                                            disabled={isUploading}
                                                        />
                                                    </label>
                                                    <span className="text-xs text-gray-600 dark:text-white/60">PNG/JPG up to ~5MB</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Preview + what we'll store */}
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/40">
                                                <div className="text-xs text-gray-600 dark:text-white/60">Live preview</div>
                                                <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">
                                                    <div className="grid h-48 place-items-center text-xs text-gray-500 dark:text-white/50">
                                                        {isUploading ? (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                                                <span>Uploading image…</span>
                                                            </div>
                                                        ) : imageFile ? (
                                                            <img src={imageUrl} alt="ID preview" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <span>No image selected</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ✅ Live form data preview */}
                                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-white/10 dark:bg-black/40">
                                                <div className="text-xs text-gray-600 dark:text-white/60">What we'll store</div>
                                                <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700 dark:text-white/80">
                                                    <li><span className="font-medium">full_name</span> — {formDetail.full_name || "—"}</li>
                                                    <li><span className="font-medium">date_of_birth</span> — {formDetail.date_of_birth || "—"}</li>
                                                    <li><span className="font-medium">id_type</span> — {formDetail.id_type || "—"}</li>
                                                    <li><span className="font-medium">id_image</span> — {formDetail.id_image ? "✓ uploaded" : "—"}</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                                            <div className="text-xs text-gray-600 dark:text-white/60">Submissions are reviewed within 24–72 hours.</div>
                                            <div className="flex gap-2">
                                                <Link to="/dashboard" className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/5">
                                                    Cancel
                                                </Link>

                                                {/* ✅ Dynamic submit button */}
                                                <button
                                                    type="submit"
                                                    disabled={!isFormValid || isSubmitting || isUploading}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white dark:text-black"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        "Submit KYC"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 dark:border-white/10 dark:bg-black/40 dark:text-white/60">
                                    If you already submitted KYC and need corrections, please contact support. Duplicate submissions aren't allowed.
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default KYC;