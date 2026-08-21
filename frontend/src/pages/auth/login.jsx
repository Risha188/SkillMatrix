import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../service/authService";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

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

    const handleSocialLogin = (provider) => {
    console.log(`${provider} login selected`);

    alert(
        `${provider} login is not connected yet.`
    );
};

   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await loginUser({
            email: formData.email.trim(),
            password: formData.password
        });

        console.log("Login Response:", response.data);

        if (response.data.success) {
            const { token, user } = response.data;

            // ==========================================
            // SAVE REAL AUTHENTICATION DATA
            // ==========================================

            localStorage.setItem("token", token);

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "userId",
                user.id
            );

            localStorage.setItem(
                "userEmail",
                user.email
            );

            localStorage.setItem(
                "userRole",
                user.role
            );

            // Keep this only if some old dashboard
            // code still uses it
            localStorage.setItem(
                "isAuthenticated",
                "true"
            );

            // ==========================================
            // EMPLOYEE LOGIN
            // ==========================================

            if (user.role === "employee") {
                navigate(
                    "/employee/dashboard",
                    { replace: true }
                );
                return;
            }

            // ==========================================
            // ADMIN LOGIN
            // ==========================================

            if (user.role === "admin") {
                navigate(
                    "/admin/dashboard",
                    { replace: true }
                );
                return;
            }

            // Unknown role
            alert("Invalid user role.");
        }

    } catch (error) {

        console.error(
            "Login Error:",
            error.response?.data || error
        );

        alert(
            error.response?.data?.message ||
            "Invalid email or password"
        );
    }
};

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

                <div className="grid md:grid-cols-2">

                    {/* ================================= */}
                    {/* LEFT SIDE */}
                    {/* ================================= */}

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


                            <h2 className="text-4xl font-bold leading-tight mb-5">
                                Welcome back!
                            </h2>


                            <p className="text-blue-100 leading-7">
                                Sign in to access your Skill Matrix
                                profile and manage your professional
                                information, skills and experience.
                            </p>

                        </div>


                        <div className="space-y-4 text-sm text-blue-100">

                            <div className="flex items-center gap-3">

                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>

                                Secure employee profile

                            </div>


                            <div className="flex items-center gap-3">

                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>

                                Manage skills and experience

                            </div>


                            <div className="flex items-center gap-3">

                                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                                    ✓
                                </span>

                                Professional skill tracking

                            </div>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* RIGHT SIDE */}
                    {/* ================================= */}

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
                                Employee Management System
                            </p>

                        </div>


                        {/* Heading */}

                        <div className="mb-7">

                            <h2 className="text-3xl font-bold text-slate-800">
                                Welcome Back
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Sign in to continue to your account.
                            </p>

                        </div>


                        {/* ================================= */}
                        {/* LOGIN FORM */}
                        {/* ================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Email */}

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
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
                                        placeholder="Enter your password"
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


                            {/* Login */}

                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-[0.99] transition shadow-lg shadow-blue-200"
                            >
                                Login
                            </button>

                        </form>


                        {/* ================================= */}
                        {/* SOCIAL LOGIN */}
                        {/* ================================= */}

                        <div className="flex items-center gap-3 my-6">

                            <div className="flex-1 h-px bg-slate-200"></div>

                            <span className="text-xs text-slate-400">
                                OR CONTINUE WITH
                            </span>

                            <div className="flex-1 h-px bg-slate-200"></div>

                        </div>


                        <div className="grid grid-cols-2 gap-3">

                            <SocialButton
                                icon="G"
                                name="Google"
                                onClick={() =>
                                    handleSocialLogin("Google")
                                }
                            />

                            <SocialButton
                                icon="in"
                                name="LinkedIn"
                                onClick={() =>
                                    handleSocialLogin("LinkedIn")
                                }
                            />

                        </div>


                        {/* ================================= */}
                        {/* REGISTRATION */}
                        {/* ================================= */}

                        <div className="text-center mt-7">

                            <p className="text-sm text-slate-500">

                                Don't have an account?{" "}

                                <Link
                                    to="/registration"
                                    className="font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Create Account
                                </Link>

                            </p>

                        </div>


                        {/* ================================= */}
                        {/* ADMIN LOGIN */}
                        {/* ================================= */}

                        <div className="mt-6 pt-5 border-t border-slate-100 text-center">

                            <p className="text-sm text-slate-500 mb-2">
                                Are you an administrator?
                            </p>

                            <Link
                                to="/admin"
                                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition"
                            >
                                Admin Login
                            </Link>

                        </div>


                        {/* Home */}

                        <div className="text-center mt-5">

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


// =============================================
// SOCIAL BUTTON
// =============================================

const SocialButton = ({
    icon,
    name,
    onClick,
}) => {

    return (

        <button
            type="button"
            onClick={onClick}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition"
        >

            <span className="font-bold">
                {icon}
            </span>

            <span className="text-sm">
                {name}
            </span>

        </button>

    );
};


export default Login;