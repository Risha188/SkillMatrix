import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { markSectionCompleted } from "../../utils/profileProgress";

const PersonalInformation = () => {
    const navigate = useNavigate();
    const initialFormData = {
        employeeId: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        alternatePhone: "",
        dateOfBirth: "",
        gender: "",
    };

    const [formData,setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        const {name,value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Personal Information:",formData);
        markSectionCompleted("personal");
        navigate("/employee/education");
    };

    const handleClear = () => {
        setFormData(initialFormData);
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    const labelClass =
        "mb-2 block text-sm font-semibold text-gray-700";

    return (
        <div className="min-h-screen w-full bg-gray-50 ">

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                        👤
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Personal Information
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Enter your basic personal and contact information.
                        </p>
                    </div>

                </div>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >

                {/* Form Header */}
                <div className="border-b border-gray-200 px-6 py-5">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Basic Details
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Please provide accurate information for your employee profile.
                    </p>
                </div>

                {/* Form Fields */}
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">

                        {/* Employee ID */}
                        <div>
                            <label htmlFor="employeeId" className={labelClass}>
                                Employee ID
                            </label>

                            <input
                                id="employeeId"
                                type="text"
                                name="employeeId"
                                placeholder="Enter employee ID"
                                value={formData.employeeId}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        {/* First Name */}
                        <div>
                            <label htmlFor="firstName" className={labelClass}>
                                First Name
                            </label>

                            <input
                                id="firstName"
                                type="text"
                                name="firstName"
                                placeholder="Enter first name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="lastName" className={labelClass}>
                                Last Name
                            </label>

                            <input
                                id="lastName"
                                type="text"
                                name="lastName"
                                placeholder="Enter last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className={labelClass}>
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className={labelClass}>
                                Phone Number
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* Alternate Phone */}
                        <div>
                            <label htmlFor="alternatePhone" className={labelClass}>
                                Alternate Phone
                            </label>

                            <input
                                id="alternatePhone"
                                type="tel"
                                name="alternatePhone"
                                placeholder="Enter alternate phone"
                                value={formData.alternatePhone}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label htmlFor="dateOfBirth" className={labelClass}>
                                Date of Birth
                            </label>

                            <input
                                id="dateOfBirth"
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label htmlFor="gender" className={labelClass}>
                                Gender
                            </label>

                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">

                    <button
                        type="button"
                        onClick={handleClear}
                        className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                        Clear
                    </button>

                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save & Next
                    </button>

                </div>

            </form>
        </div>
    );
};

export default PersonalInformation;