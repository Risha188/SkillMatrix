import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import {markSectionCompleted} from "../../utils/profileProgress.js";

const BDM = () => {
    const navigate = useNavigate();
    const [bdmData,setBdmData] = useState({
        skills: [],
        languages: "",
        hobbies: "",
        interests: "",
        strengths: "",
        additionalInformation: "",
    });

    const [skillInput,setSkillInput] = useState("");

    const handleChange = (e) => {
        const {name,value} = e.target;

        setBdmData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Add any skill entered by employee
    const handleAddSkill = () => {
        const skill = skillInput.trim();

        if(!skill) return;

        // Prevent duplicate skills
        if(
            bdmData.skills.some(
                (item) => item.toLowerCase() === skill.toLowerCase()
            )
        ) {
            return;
        }

        setBdmData((prev) => ({
            ...prev,
            skills: [...prev.skills,skill],
        }));

        setSkillInput("");
    };

    // Remove skill
    const handleRemoveSkill = (skillToRemove) => {
        setBdmData((prev) => ({
            ...prev,
            skills: prev.skills.filter(
                (skill) => skill !== skillToRemove
            ),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("BDM Details:",bdmData);

        alert("Employee profile saved successfully!");
        markSectionCompleted("bdm");
        navigate("/employee/declaration");
    };

    const handleClear = () => {
        setBdmData({
            skills: [],
            languages: "",
            hobbies: "",
            interests: "",
            strengths: "",
            additionalInformation: "",
        });

        setSkillInput("");
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    const labelClass =
        "mb-2 block text-sm font-medium text-gray-700";

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">

            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                            👔
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                BDM Details
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Add your non-technical skills, strengths,
                                interests and other professional qualities.
                            </p>
                        </div>

                    </div>

                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-xl bg-white shadow-md"
                >

                    {/* Form Header */}
                    <div className="border-b border-gray-200 px-6 py-5">

                        <h3 className="text-lg font-semibold text-gray-800">
                            Additional Skills & Professional Qualities
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Add any non-technical skills that describe
                            your professional and personal abilities.
                        </p>

                    </div>

                    {/* Form Body */}
                    <div className="p-6">

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                            {/* Skills */}
                            <div className="md:col-span-2">

                                <label
                                    htmlFor="skillInput"
                                    className={labelClass}
                                >
                                    Non-Technical Skills
                                </label>

                                <div className="flex gap-3">

                                    <input
                                        id="skillInput"
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) =>
                                            setSkillInput(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if(e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddSkill();
                                            }
                                        }}
                                        placeholder="Enter any skill e.g. Communication, Leadership, Time Management"
                                        className={inputClass}
                                    />

                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                        className="shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        Add Skill
                                    </button>

                                </div>

                                {/* Added Skills */}
                                {bdmData.skills.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">

                                        {bdmData.skills.map((skill,index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                                            >

                                                <span>{skill}</span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveSkill(skill)
                                                    }
                                                    className="text-blue-500 transition hover:text-red-500"
                                                >
                                                    ×
                                                </button>

                                            </div>
                                        ))}

                                    </div>
                                )}

                                <p className="mt-2 text-xs text-gray-400">
                                    You can add as many non-technical skills
                                    as you want.
                                </p>

                            </div>

                            {/* Languages */}
                            <div>

                                <label
                                    htmlFor="languages"
                                    className={labelClass}
                                >
                                    Languages Known
                                </label>

                                <input
                                    id="languages"
                                    type="text"
                                    name="languages"
                                    placeholder="e.g. English, Hindi, Bengali"
                                    value={bdmData.languages}
                                    onChange={handleChange}
                                    className={inputClass}
                                />

                            </div>

                            {/* Hobbies */}
                            <div>

                                <label
                                    htmlFor="hobbies"
                                    className={labelClass}
                                >
                                    Hobbies
                                </label>

                                <input
                                    id="hobbies"
                                    type="text"
                                    name="hobbies"
                                    placeholder="e.g. Dancing, Reading, Travelling"
                                    value={bdmData.hobbies}
                                    onChange={handleChange}
                                    className={inputClass}
                                />

                            </div>

                            {/* Interests */}
                            <div>

                                <label
                                    htmlFor="interests"
                                    className={labelClass}
                                >
                                    Areas of Interest
                                </label>

                                <input
                                    id="interests"
                                    type="text"
                                    name="interests"
                                    placeholder="e.g. Management, Public Speaking"
                                    value={bdmData.interests}
                                    onChange={handleChange}
                                    className={inputClass}
                                />

                            </div>

                            {/* Strengths */}
                            <div>

                                <label
                                    htmlFor="strengths"
                                    className={labelClass}
                                >
                                    Key Strengths
                                </label>

                                <textarea
                                    id="strengths"
                                    name="strengths"
                                    rows="4"
                                    placeholder="Describe your key strengths..."
                                    value={bdmData.strengths}
                                    onChange={handleChange}
                                    className={`${inputClass} resize-none`}
                                />

                            </div>

                            {/* Additional Information */}
                            <div className="md:col-span-2">

                                <label
                                    htmlFor="additionalInformation"
                                    className={labelClass}
                                >
                                    Additional Information
                                </label>

                                <textarea
                                    id="additionalInformation"
                                    name="additionalInformation"
                                    rows="4"
                                    placeholder="Enter anything else you would like to mention..."
                                    value={bdmData.additionalInformation}
                                    onChange={handleChange}
                                    className={`${inputClass} resize-none`}
                                />

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

        </div>
    );
};

export default BDM;