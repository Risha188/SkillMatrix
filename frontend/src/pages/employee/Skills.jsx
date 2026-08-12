import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import {markSectionCompleted} from "../../utils/profileProgress.js";

const Skills = () => {
    const navigate = useNavigate();
    const [skills,setSkills] = useState([
        {
            skill: "",
            category: "",
            proficiency: "",
            experience: "",
        },
    ]);

    const handleChange = (index,e) => {
        const {name,value} = e.target;

        const updatedSkills = [...skills];

        updatedSkills[index][name] = value;

        setSkills(updatedSkills);
    };

    const addSkill = () => {
        setSkills([
            ...skills,
            {
                skill: "",
                category: "",
                proficiency: "",
                experience: "",
            },
        ]);
    };

    const removeSkill = (index) => {
        if(skills.length === 1) {
            return;
        }

        const updatedSkills = skills.filter(
            (_,skillIndex) => skillIndex !== index
        );

        setSkills(updatedSkills);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Skills Information:",skills);
        markSectionCompleted("skills");
        navigate("/employee/experience");
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Skills
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Add your primary and secondary technical skills.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Technical Skills Section */}
                    <div className="rounded-xl bg-white p-6 shadow-md">

                        {/* Section Header */}
                        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Technical Skills
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Add all relevant skills along with your proficiency
                                    and experience.
                                </p>
                            </div>

                            {/* Add Skill */}
                            <button
                                type="button"
                                onClick={addSkill}
                                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                + Add Skill
                            </button>
                        </div>

                        {/* Skill Cards */}
                        <div className="space-y-5">
                            {skills.map((skillItem,index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                                >

                                    {/* Skill Card Header */}
                                    <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-4">
                                        <h4 className="text-base font-semibold text-gray-800">
                                            Skill {index + 1}
                                        </h4>

                                        {skills.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(index)}
                                                className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    {/* Skill Fields */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                        {/* Skill */}
                                        <div>
                                            <label
                                                htmlFor={`skill-${index}`}
                                                className="mb-2 block text-sm font-medium text-gray-700"
                                            >
                                                Skill
                                            </label>

                                            <input
                                                id={`skill-${index}`}
                                                type="text"
                                                name="skill"
                                                placeholder="e.g. React.js"
                                                value={skillItem.skill}
                                                onChange={(e) => handleChange(index,e)}
                                                required
                                                className={inputClass}
                                            />
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <label
                                                htmlFor={`category-${index}`}
                                                className="mb-2 block text-sm font-medium text-gray-700"
                                            >
                                                Category
                                            </label>

                                            <select
                                                id={`category-${index}`}
                                                name="category"
                                                value={skillItem.category}
                                                onChange={(e) => handleChange(index,e)}
                                                required
                                                className={inputClass}
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Frontend">Frontend</option>
                                                <option value="Backend">Backend</option>
                                                <option value="Database">Database</option>
                                                <option value="Programming">Programming</option>
                                                <option value="DevOps">DevOps</option>
                                                <option value="Testing">Testing</option>
                                                <option value="Tools">Tools</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        {/* Proficiency */}
                                        <div>
                                            <label
                                                htmlFor={`proficiency-${index}`}
                                                className="mb-2 block text-sm font-medium text-gray-700"
                                            >
                                                Proficiency
                                            </label>

                                            <select
                                                id={`proficiency-${index}`}
                                                name="proficiency"
                                                value={skillItem.proficiency}
                                                onChange={(e) => handleChange(index,e)}
                                                required
                                                className={inputClass}
                                            >
                                                <option value="">Select Proficiency</option>
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                                <option value="Expert">Expert</option>
                                            </select>
                                        </div>

                                        {/* Experience */}
                                        <div>
                                            <label
                                                htmlFor={`experience-${index}`}
                                                className="mb-2 block text-sm font-medium text-gray-700"
                                            >
                                                Experience
                                            </label>

                                            <select
                                                id={`experience-${index}`}
                                                name="experience"
                                                value={skillItem.experience}
                                                onChange={(e) => handleChange(index,e)}
                                                required
                                                className={inputClass}
                                            >
                                                <option value="">Select Experience</option>
                                                <option value="Less than 1 year">
                                                    Less than 1 year
                                                </option>
                                                <option value="1-2 years">1-2 years</option>
                                                <option value="2-4 years">2-4 years</option>
                                                <option value="4-6 years">4-6 years</option>
                                                <option value="6+ years">6+ years</option>
                                            </select>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Primary Skills */}
                    <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Primary Skills
                        </h3>

                        <p className="mt-1 text-sm text-gray-600">
                            Your primary skills are the technologies or areas in which
                            you have the strongest expertise.
                        </p>

                        {/* Primary Skills List */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {skills
                                .filter((item) => item.skill)
                                .map((item,index) => (
                                    <span
                                        key={index}
                                        className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white"
                                    >
                                        {item.skill}
                                    </span>
                                ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="mt-6 flex justify-end border-t border-gray-200 pt-6">
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

export default Skills;