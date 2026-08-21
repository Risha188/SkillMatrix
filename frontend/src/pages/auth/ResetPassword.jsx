import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../service/authService";

const ResetPassword = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!email) {
            setError(
                "Email information is missing. Please start the password reset again."
            );
            return;
        }

        if (newPassword.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        setLoading(true);

        try {

            const response = await resetPassword({
                email: email,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            });

            console.log(
                "Reset Password Response:",
                response.data
            );

            if (response.data.success) {

                setSuccess(
                    "Password reset successfully. Redirecting to login..."
                );

                setNewPassword("");
                setConfirmPassword("");

                setTimeout(() => {
                    navigate("/login");
                }, 2000);

            } else {

                setError(
                    response.data.message ||
                    "Unable to reset password."
                );
            }

        } catch (error) {

            console.error(
                "Reset Password Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

                <div className="grid md:grid-cols-2">

                    {/* LEFT */}

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
                                Create a new password.
                            </h2>

                            <p className="mt-4 text-blue-100 leading-7">
                                Choose a strong password to protect
                                your employee account.
                            </p>

                        </div>

                        <div className="space-y-4 text-sm text-blue-100">

                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>
                                Secure password recovery
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>
                                Encrypted password storage
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>
                                Protected employee account
                            </div>

                        </div>

                    </div>


                    {/* RIGHT */}

                    <div className="p-6 sm:p-10">

                        <div className="md:hidden text-center mb-7">

                            <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 text-white items-center justify-center font-bold text-xl mb-2">
                                SM
                            </div>

                            <h1 className="text-2xl font-bold text-slate-800">
                                Skill Matrix
                            </h1>

                        </div>


                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-6">
                            🔑
                        </div>


                        <div className="mb-7">

                            <h2 className="text-3xl font-bold text-slate-800">
                                Reset Password
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Create a new password for:
                            </p>

                            <p className="font-semibold text-blue-600 mt-1 break-all">
                                {email}
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


                        {/* SUCCESS */}

                        {success && (

                            <div className="mb-5 rounded-xl bg-green-50 border border-green-200 p-4">

                                <p className="text-sm text-green-700">
                                    {success}
                                </p>

                            </div>

                        )}


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* NEW PASSWORD */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter new password"
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                                />

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Confirm new password"
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                                />

                            </div>


                            {/* RESET */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >

                                {loading
                                    ? "Resetting Password..."
                                    : "Reset Password"
                                }

                            </button>

                        </form>


                        <div className="text-center mt-7">

                            <Link
                                to="/login"
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
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

export default ResetPassword;