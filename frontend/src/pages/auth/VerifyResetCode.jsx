import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyResetCode } from "../../service/authService";

const VerifyResetCode = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [resetCode, setResetCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email) {
            setError("Email information is missing. Please start again.");
            return;
        }

        if (resetCode.length !== 6) {
            setError("Please enter the 6-digit verification code.");
            return;
        }

        setLoading(true);

        try {

            const response = await verifyResetCode({
                email: email,
                resetCode: resetCode
            });

            console.log(
                "Verify Reset Code Response:",
                response.data
            );

            if (response.data.success) {

                navigate("/reset-password", {
                    state: {
                        email: email
                    }
                });

            } else {

                setError(
                    response.data.message ||
                    "Invalid verification code."
                );
            }

        } catch (error) {

            console.error(
                "Verify Reset Code Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to verify the code. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

                <div className="grid md:grid-cols-2">

                    {/* LEFT SIDE */}

                    <div className="hidden md:flex bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white p-10 flex-col justify-between">

                        <div>

                            <div className="flex items-center gap-3 mb-10">

                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                                    SM
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold">
                                        Skill Matrix
                                    </h1>

                                    <p className="text-blue-100 text-sm">
                                        Employee Management System
                                    </p>
                                </div>

                            </div>

                            <h2 className="text-4xl font-bold leading-tight">
                                Verify your account.
                            </h2>

                            <p className="mt-4 text-blue-100 leading-7">
                                Enter the verification code sent to
                                your registered email address.
                            </p>

                        </div>

                        <div className="space-y-4 text-sm text-blue-100">

                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>
                                Secure verification
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>
                                One-time verification code
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>
                                Protected password recovery
                            </div>

                        </div>

                    </div>


                    {/* RIGHT SIDE */}

                    <div className="p-6 sm:p-10">

                        {/* Mobile Logo */}

                        <div className="md:hidden text-center mb-7">

                            <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 text-white items-center justify-center font-bold text-xl mb-2">
                                SM
                            </div>

                            <h1 className="text-2xl font-bold text-slate-800">
                                Skill Matrix
                            </h1>

                        </div>


                        {/* Icon */}

                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-6">
                            🔐
                        </div>


                        <div className="mb-7">

                            <h2 className="text-3xl font-bold text-slate-800">
                                Verify Reset Code
                            </h2>

                            <p className="text-slate-500 mt-2 leading-6">
                                Enter the 6-digit code sent to:
                            </p>

                            <p className="font-semibold text-blue-600 mt-1 break-all">
                                {email || "your registered email"}
                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-4">

                                <p className="text-sm text-red-700">
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Verification Code
                                </label>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={resetCode}
                                    onChange={(e) => {
                                        const value =
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            );

                                        setResetCode(value);
                                    }}
                                    placeholder="Enter 6-digit code"
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-center text-2xl tracking-[0.5em] font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                                />

                            </div>


                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    resetCode.length !== 6
                                }
                                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >

                                {loading
                                    ? "Verifying..."
                                    : "Verify Code"
                                }

                            </button>

                        </form>


                        <div className="text-center mt-7">

                            <Link
                                to="/forgot-password"
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                ← Back to Forgot Password
                            </Link>

                        </div>


                        <div className="text-center mt-4">

                            <Link
                                to="/login"
                                className="text-sm text-slate-500 hover:text-blue-600"
                            >
                                ← Back to Login
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default VerifyResetCode;