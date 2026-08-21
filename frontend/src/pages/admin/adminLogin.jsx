 import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../service/authService";
const AdminLogin = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await loginUser({
            email: formData.email.trim(),
            password: formData.password,
        });

        const data = response.data;

        if (!data.success) {
            alert(data.message || "Login failed.");
            return;
        }

        // ==========================================
        // CHECK ADMIN ROLE
        // ==========================================

        if (data.user.role !== "admin") {
            alert("You are not an administrator.");
            return;
        }

        // ==========================================
        // SAVE ADMIN AUTH DATA
        // ==========================================

        localStorage.setItem("token", data.token);

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        localStorage.setItem(
            "userId",
            data.user.id
        );

        localStorage.setItem(
            "userEmail",
            data.user.email
        );

        localStorage.setItem(
            "userRole",
            data.user.role
        );

        // ==========================================
        // ADMIN LOGIN SUCCESS
        // ==========================================

        alert("Admin login successful!");

        navigate("/admin/dashboard", {
            replace: true
        });

    } catch (error) {

        console.error(
            "Admin Login Error:",
            error.response?.data || error
        );

        alert(
            error.response?.data?.message ||
            "Invalid admin email or password."
        );
    }
};
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

                <div className="grid md:grid-cols-2">

                    {/* ========================= */}
                    {/* LEFT SIDE */}
                    {/* ========================= */}

                    <div className="hidden md:flex bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 text-white p-10 flex-col justify-between">

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

                                    <p className="text-slate-300 text-sm">
                                        Administration Portal
                                    </p>

                                </div>

                            </div>


                            {/* Heading */}

                            <h2 className="text-4xl font-bold leading-tight mb-5">
                                Administrator Access
                            </h2>

                        </div>


                        {/* Security Information */}

                        <div className="space-y-4 text-sm text-slate-300">

                            <div className="flex items-center gap-3">

                                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                                    ✓
                                </span>

                                Secure administrator access

                            </div>


                            <div className="flex items-center gap-3">

                                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                                    ✓
                                </span>

                                Employee management

                            </div>


                            <div className="flex items-center gap-3">

                                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                                    ✓
                                </span>

                                Centralized system control

                            </div>

                        </div>

                    </div>


                    {/* ========================= */}
                    {/* RIGHT SIDE */}
                    {/* ========================= */}

                    <div className="p-6 sm:p-10">

                        {/* Mobile Logo */}

                        <div className="md:hidden text-center mb-7">

                            <div className="inline-flex w-12 h-12 rounded-xl bg-slate-800 text-white items-center justify-center font-bold text-xl mb-2">
                                SM
                            </div>

                            <h1 className="text-2xl font-bold text-slate-800">
                                Skill Matrix
                            </h1>

                            <p className="text-sm text-slate-500">
                                Administration Portal
                            </p>

                        </div>


                        {/* Heading */}

                        <div className="mb-7">

                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-4">

                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>

                                ADMINISTRATOR

                            </div>


                            <h2 className="text-3xl font-bold text-slate-800">
                                Admin Login
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Sign in to access the administration portal.
                            </p>

                        </div>


                        {/* ========================= */}
                        {/* Login Form */}
                        {/* ========================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Email */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Admin Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter admin email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />

                            </div>


                            {/* Password */}

                            <div>

                                <div className="flex items-center justify-between mb-1.5">

                                    <label className="block text-sm font-medium text-slate-700">
                                        Password
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        Forgot Password?
                                    </Link>

                                </div>


                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter admin password"
                                        required
                                        className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
                                    >
                                        {showPassword
                                            ? "🙈"
                                            : "👁"}
                                    </button>

                                </div>

                            </div>


                            {/* Login Button */}

                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900 active:scale-[0.99] transition shadow-lg shadow-slate-200"
                            >
                                Admin Login
                            </button>

                        </form>


                        {/* Security Notice */}

                        <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">

                            <div className="flex gap-3">

                                <div className="text-blue-400 text-lg">
                                    🔒
                                </div>

                                <div>

                                    <p className="text-sm font-semibold text-blue-800">
                                        Secure Access
                                    </p>

                                    <p className="text-xs text-blue-600 mt-1 leading-5">
                                        This area is restricted to authorized
                                        administrators only.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Employee Login */}

                        <div className="text-center mt-7">

                            <p className="text-sm text-slate-500">

                                Are you an employee?{" "}

                                <Link
                                    to="/login"
                                    className="font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Employee Login
                                </Link>

                            </p>

                        </div>


                        {/* Registration */}

                        {/* Admin Registration */}

<div className="text-center mt-5">
    <p className="text-sm text-slate-500">
        Don't have an admin account?{" "}
        <Link
            to="/admin/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
        >
            Create Admin Account
        </Link>
    </p>
</div>

{/* Back to Employee Registration */}

<div className="text-center mt-3">

    <Link
        to="/registration"
        className="text-sm text-slate-500 hover:text-blue-600"
    >
        ← Employee Registration
    </Link>

</div>

                        {/* Home */}

                        <div className="text-center mt-3">

                            <Link
                                to="/"
                                className="text-sm text-slate-500 hover:text-blue-600"
                            >
                                ← Back to Home
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminLogin;