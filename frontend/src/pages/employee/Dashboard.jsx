import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

import {
    PROFILE_SECTIONS,
} from "../../utils/profileProgress.js";

import {
    useEmployeeProfile,
} from "../../context/EmployeeProfileContext.jsx";

// =========================================================
// HELPER: CHECK IF AN OBJECT HAS REAL USER DATA
// =========================================================

const hasValue = (value) => {
    if (value === null || value === undefined) {
        return false;
    }

    if (typeof value === "string") {
        return value.trim().length > 0;
    }

    if (typeof value === "number") {
        return true;
    }

    if (typeof value === "boolean") {
        return value === true;
    }

    if (Array.isArray(value)) {
        return value.length > 0;
    }

    if (typeof value === "object") {
        return Object.values(value).some(hasValue);
    }

    return false;
};

// =========================================================
// CHECK EACH PROFILE SECTION FROM ACTUAL DATABASE PROFILE
// =========================================================

const getSectionCompletion = (profile) => {
    if (!profile) {
        return {};
    }

    // -----------------------------------------------------
    // PERSONAL INFORMATION
    // -----------------------------------------------------

    const personal = profile.personalDetails || {};

    const personalCompleted = [
        personal.firstName,
        personal.lastName,
        personal.email,
        personal.phone,
        personal.alternatePhone,
        personal.dateOfBirth,
        personal.gender,
    ].some(hasValue);

    // -----------------------------------------------------
    // EDUCATION
    // -----------------------------------------------------

    const education = profile.education || {};

    const educationCompleted = [
        education.highestQualification,
        education.course,
        education.specialization,
        education.university,
        education.college,
        education.passingYear,
        education.percentage,
        education.cgpa,
    ].some(hasValue);

    // -----------------------------------------------------
    // ADDRESS
    // -----------------------------------------------------

    const currentAddress = profile.address?.current || {};
    const permanentAddress = profile.address?.permanent || {};

    const addressCompleted =
        hasValue(currentAddress) ||
        hasValue(permanentAddress);

    // -----------------------------------------------------
    // SKILLS
    // -----------------------------------------------------

    const skillsCompleted =
        Array.isArray(profile.skills) &&
        profile.skills.length > 0;

    // -----------------------------------------------------
    // WORK EXPERIENCE
    //
    // Fresher = section is complete because no previous
    // employment details are required.
    // -----------------------------------------------------

    const experienceCompleted =
        profile.isFresher === true ||
        (
            Array.isArray(profile.workExperience) &&
            profile.workExperience.length > 0
        );

    // -----------------------------------------------------
    // BDM DETAILS
    // -----------------------------------------------------

    const bdm = profile.bdmDetails || {};

    const bdmCompleted =
        (Array.isArray(bdm.nonTechnicalSkills) &&
            bdm.nonTechnicalSkills.length > 0) ||
        (Array.isArray(bdm.languagesKnown) &&
            bdm.languagesKnown.length > 0) ||
        (Array.isArray(bdm.hobbies) &&
            bdm.hobbies.length > 0) ||
        (Array.isArray(bdm.areasOfInterest) &&
            bdm.areasOfInterest.length > 0) ||
        hasValue(bdm.keyStrengths) ||
        hasValue(bdm.additionalInformation);

    return {
        personal: personalCompleted,
        education: educationCompleted,
        address: addressCompleted,
        skills: skillsCompleted,
        experience: experienceCompleted,
        bdm: bdmCompleted,
    };
};

// =========================================================
// GET EMPLOYEE FIRST NAME
// =========================================================

const getFirstName = () => {
    try {
        const employeeUser = JSON.parse(
            sessionStorage.getItem("employeeUser") || "{}"
        );

        // Prefer firstName directly
        if (
            employeeUser.firstName &&
            String(employeeUser.firstName).trim()
        ) {
            return String(employeeUser.firstName).trim();
        }

        // Otherwise use fullName
        const fullName =
            employeeUser.fullName ||
            employeeUser.name ||
            "";

        if (String(fullName).trim()) {
            return String(fullName)
                .trim()
                .split(/\s+/)[0];
        }

        return "Employee";
    } catch (error) {
        console.error(
            "Failed to read employee name:",
            error
        );

        return "Employee";
    }
};

// =========================================================
// DASHBOARD
// =========================================================

const Dashboard = () => {
    const {
        profile,
        loading,
        error,
        refreshProfile,
    } = useEmployeeProfile();

    const [firstName, setFirstName] =
        useState("Employee");

    // =====================================================
    // LOAD EMPLOYEE NAME
    // =====================================================

    useEffect(() => {
        setFirstName(getFirstName());
    }, []);

    // =====================================================
    // REFRESH PROFILE WHEN DASHBOARD OPENS
    // =====================================================

    useEffect(() => {
        refreshProfile();
    }, []);

    // =====================================================
    // CALCULATE COMPLETION FROM DATABASE DATA
    //
    // IMPORTANT:
    // We DO NOT use localStorage completedProfileSections.
    //
    // This means deleting an employee's profile data from
    // MongoDB will immediately result in 0% / incomplete
    // sections instead of showing old 100% localStorage data.
    // =====================================================

    const sectionStatus = useMemo(() => {
        return getSectionCompletion(profile);
    }, [profile]);

    const completedSections =
        useMemo(() => {
            return PROFILE_SECTIONS
                .filter(
                    (section) =>
                        sectionStatus[
                            section.key
                        ] === true
                )
                .map(
                    (section) =>
                        section.key
                );
        }, [sectionStatus]);

    const totalSections =
        PROFILE_SECTIONS.length;

    const completedCount =
        completedSections.length;

    const remainingCount =
        Math.max(
            totalSections -
                completedCount,
            0
        );

    const completionPercentage =
        totalSections === 0
            ? 0
            : Math.round(
                (completedCount /
                    totalSections) *
                    100
            );

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">

            <div className="mx-auto w-full max-w-6xl">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                        Employee Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your employee profile and keep your
                        information up to date.
                    </p>
                </div>

                {/* =================================================
                    PROFILE LOAD ERROR
                ================================================= */}

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* =================================================
                    WELCOME CARD
                ================================================= */}

                <div className="mb-6 rounded-xl bg-blue-500 p-5 text-white shadow-md sm:p-6">

                    <div>
                        <h2 className="text-xl font-bold sm:text-2xl">
                            Welcome, {firstName} 👋
                        </h2>

                        <p className="mt-2 text-sm text-blue-100">
                            Complete your employee profile to make
                            sure all your information is available.
                        </p>
                    </div>

                </div>

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (
                    <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                        <p className="text-sm text-gray-500">
                            Loading your profile...
                        </p>
                    </div>
                ) : (
                    <>
                        {/* =========================================
                            PROFILE COMPLETION
                        ========================================= */}

                        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                            <div className="mb-3 flex items-center justify-between gap-4">

                                <div>
                                    <h3 className="text-base font-semibold text-gray-800">
                                        Profile Completion
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                        {completedCount} of{" "}
                                        {totalSections} sections completed
                                    </p>
                                </div>

                                <span className="text-lg font-bold text-blue-600 sm:text-xl">
                                    {completionPercentage}%
                                </span>

                            </div>

                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                <div
                                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                    style={{
                                        width: `${completionPercentage}%`,
                                    }}
                                />
                            </div>

                            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
                                {remainingCount === 0
                                    ? "Your profile is complete! 🎉"
                                    : `You have ${remainingCount} section${
                                        remainingCount === 1
                                            ? ""
                                            : "s"
                                    } remaining.`}
                            </p>

                        </div>

                        {/* =========================================
                            SUMMARY CARDS
                        ========================================= */}

                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-lg">
                                        ✓
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Completed
                                        </p>

                                        <p className="text-xl font-bold text-gray-800">
                                            {completedCount}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-lg">
                                        ⏳
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Remaining
                                        </p>

                                        <p className="text-xl font-bold text-gray-800">
                                            {remainingCount}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg">
                                        📊
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Completion
                                        </p>

                                        <p className="text-xl font-bold text-gray-800">
                                            {completionPercentage}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* =========================================
                            PROFILE SECTIONS
                        ========================================= */}

                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                            <div className="border-b border-gray-200 px-5 py-4 sm:px-6">

                                <h3 className="font-semibold text-gray-800">
                                    Profile Sections
                                </h3>

                                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                    Complete or edit your employee
                                    profile sections.
                                </p>

                            </div>

                            <div>
                                {PROFILE_SECTIONS.map(
                                    (section) => {
                                        const completed =
                                            sectionStatus[
                                                section.key
                                            ] === true;

                                        return (
                                            <div
                                                key={section.key}
                                                className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-4 last:border-b-0 sm:px-6"
                                            >

                                                <div className="flex min-w-0 items-center gap-3">

                                                    <div
                                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                                                            completed
                                                                ? "bg-green-100 text-green-600"
                                                                : "bg-gray-100 text-gray-400"
                                                        }`}
                                                    >
                                                        {completed
                                                            ? "✓"
                                                            : "○"}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-gray-800">
                                                            {section.name}
                                                        </p>

                                                        <p
                                                            className={`mt-1 text-xs ${
                                                                completed
                                                                    ? "text-green-600"
                                                                    : "text-gray-400"
                                                            }`}
                                                        >
                                                            {completed
                                                                ? "Completed"
                                                                : "Not completed"}
                                                        </p>
                                                    </div>

                                                </div>

                                                <NavLink
                                                    to={section.path}
                                                    className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition sm:px-4 ${
                                                        completed
                                                            ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                                            : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                                                    }`}
                                                >
                                                    {completed
                                                        ? "Edit"
                                                        : "Complete"}
                                                </NavLink>

                                            </div>
                                        );
                                    }
                                )}
                            </div>

                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default Dashboard;
