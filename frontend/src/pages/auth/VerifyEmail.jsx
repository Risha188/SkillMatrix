import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyEmail } from "../../service/authService";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Email comes from Registration page
    const email =
    location.state?.email ||
    localStorage.getItem("verificationEmail") ||
    "";

    const [verificationCode, setVerificationCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // HANDLE CODE INPUT
    // ==========================================

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");

        setVerificationCode(value);
        setError("");
        setSuccess("");
    };

    // ==========================================
    // VERIFY EMAIL
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Check email
        if (!email) {
            setError(
                "Registration email is missing. Please register again."
            );
            return;
        }

        // Check code
        if (!verificationCode) {
            setError("Please enter the verification code.");
            return;
        }

        if (verificationCode.length !== 6) {
            setError("Verification code must be 6 digits.");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await verifyEmail({
                email: email,
                verificationCode: verificationCode
            });

            console.log(
                "Email Verification Response:",
                response.data
            );

            if (response.data.success) {
                setSuccess(
                    "Email verified successfully!"
                );

                // Go to password creation
                setTimeout(() => {
                    navigate("/set-password", {
                        state: {
                            email: email
                        }
                    });
                }, 700);
            }

        } catch (error) {
            console.error(
                "Email Verification Error:",
                error
            );

            console.error(
                "Response:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Invalid or expired verification code."
            );

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

                <div className="grid md:grid-cols-2">

                    {/* ========================================= */}
                    {/* LEFT SIDE */}
                    {/* ========================================= */}

                    <div className="hidden md:flex bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white p-10 flex-col justify-between">

                        <div>

                            {/* Logo */}

                            <div className="flex items-center gap-3 mb-10">

                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl font-bold border border-white/10">
                                    SM
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold">
                                        Skill Matrix
                                    </h1>

                                    <p className="text-blue-100 text-sm">
                                        Employee Portal
                                    </p>
                                </div>

                            </div>

                            <h2 className="text-4xl font-bold leading-tight mb-5">
                                Verify Your Email
                            </h2>

                            <p className="text-blue-100 leading-7">
                                We sent a verification code to your
                                registered email address. Verify your
                                email to continue creating your account.
                            </p>

                        </div>

                        {/* Features */}

                        <div className="space-y-4 text-sm text-blue-100">

                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                                    ✓
                                </span>

                                Secure email verification
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                                    ✓
                                </span>

                                Protect your Skill Matrix account
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                                    ✓
                                </span>

                                Continue to create your password
                            </div>

                        </div>

                    </div>


                    {/* ========================================= */}
                    {/* RIGHT SIDE */}
                    {/* ========================================= */}

                    <div className="p-6 sm:p-10">

                        {/* Mobile Logo */}

                        <div className="md:hidden text-center mb-7">

                            <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 text-white items-center justify-center font-bold text-xl mb-2">
                                SM
                            </div>

                            <h1 className="text-2xl font-bold text-slate-800">
                                Skill Matrix
                            </h1>

                            <p className="text-sm text-slate-500">
                                Employee Portal
                            </p>

                        </div>


                        {/* Heading */}

                        <div className="mb-7">

                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-4">

                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>

                                EMAIL VERIFICATION

                            </div>

                            <h2 className="text-3xl font-bold text-slate-800">
                                Verify Email
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Enter the 6-digit verification code
                                sent to your email.
                            </p>

                        </div>


                        {/* Email */}

                        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">

                            <p className="text-xs text-slate-500 mb-1">
                                Verification email
                            </p>

                            <p className="font-medium text-slate-700 break-all">
                                {email || "Email not available"}
                            </p>

                        </div>


                        {/* Error */}

                        {error && (
                            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}


                        {/* Success */}

                        {success && (
                            <div className="mb-5 p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
                                {success}
                            </div>
                        )}


                        {/* ========================================= */}
                        {/* VERIFICATION FORM */}
                        {/* ========================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Verification Code */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Verification Code
                                </label>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={verificationCode}
                                    onChange={handleChange}
                                    placeholder="Enter 6-digit code"
                                    autoComplete="one-time-code"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-center text-xl tracking-[0.5em] font-semibold"
                                />

                            </div>


                            {/* Verify Button */}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300 active:scale-[0.99] transition shadow-lg shadow-blue-200"
                            >
                                {isSubmitting
                                    ? "Verifying..."
                                    : "Verify Email"}
                            </button>

                        </form>


                        {/* Back to Registration */}

                        <div className="text-center mt-7">

                            <p className="text-sm text-slate-500">

                                Didn't register with this email?{" "}

                                <Link
                                    to="/registration"
                                    className="font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Register Again
                                </Link>

                            </p>

                        </div>


                        {/* Login */}

                        <div className="text-center mt-3">

                            <Link
                                to="/login"
                                className="text-sm text-slate-500 hover:text-blue-600"
                            >
                                Back to Login
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default VerifyEmail;