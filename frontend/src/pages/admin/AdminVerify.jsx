 import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminVerify = () => {

    const navigate = useNavigate();

    const [code, setCode] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const email = localStorage.getItem(
        "adminVerificationEmail"
    );

    const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
        const email = localStorage.getItem("adminVerificationEmail");

        if (!email) {
            setError("Registration email not found. Please register again.");
            return;
        }

        const response = await axios.post(
            "http://localhost:5000/api/admin/verify",
            {
                email: email,
                verificationCode: verificationCode
            }
        );

        if (response.data.success) {
            localStorage.setItem(
                "adminVerifiedEmail",
                email
            );

            navigate("/admin/set-password");
        }

    } catch (error) {

        console.error(
            "Admin Verification Error:",
            error.response?.data || error
        );

        setError(
            error.response?.data?.message ||
            "Invalid verification code"
        );

    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <div className="text-center mb-8">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 text-xl font-bold text-white">
                        SM
                    </div>

                    <h1 className="text-3xl font-bold text-slate-800">
                        Verify Admin Email
                    </h1>

                    <p className="text-sm text-slate-500 mt-2">
                        Enter the 6-digit verification code
                        sent to your email.
                    </p>

                </div>

                {email && (
                    <div className="mb-5 rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm">
                        <p className="text-slate-500">
                            Verification email
                        </p>

                        <p className="font-semibold text-slate-800 mt-1">
                            {email}
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Verification Code
                        </label>

                        <input
                            type="text"
                            maxLength="6"
                            value={code}
                            onChange={(e) =>
                                setCode(
                                    e.target.value.replace(
                                        /\D/g,
                                        ""
                                    )
                                )
                            }
                            placeholder="Enter 6-digit code"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-xl tracking-[0.5em] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify Email"}
                    </button>

                </form>

                <div className="text-center mt-6">

                    <Link
                        to="/admin/register"
                        className="text-sm text-blue-600"
                    >
                        Register Again
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default AdminVerify;