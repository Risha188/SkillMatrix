import React,{useState} from "react";

const Skills = () => {
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
    };

    return (
        <div className="form-page">

            {/* Header */}
            <div className="form-header">
                <h2>Skills</h2>

                <p>
                    Add your primary and secondary technical skills.
                </p>
            </div>

            <form onSubmit={handleSubmit}>

                {/* Skills */}

                <div className="skills-section">

                    <div className="skills-section-header">
                        <div>
                            <h3>Technical Skills</h3>

                            <p>
                                Add all relevant skills along with your
                                proficiency and experience.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="add-skill-btn"
                            onClick={addSkill}
                        >
                            + Add Skill
                        </button>
                    </div>


                    {/* Skill Cards */}

                    {skills.map((skillItem,index) => (
                        <div
                            className="skill-card"
                            key={index}
                        >

                            <div className="skill-card-header">

                                <h4>
                                    Skill {index + 1}
                                </h4>

                                {skills.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-skill-btn"
                                        onClick={() => removeSkill(index)}
                                    >
                                        Remove
                                    </button>
                                )}

                            </div>


                            <div className="form-grid">

                                {/* Skill */}

                                <div className="form-group">
                                    <label>Skill</label>

                                    <input
                                        type="text"
                                        name="skill"
                                        placeholder="e.g. React.js"
                                        value={skillItem.skill}
                                        onChange={(e) =>
                                            handleChange(index,e)
                                        }
                                        required
                                    />
                                </div>


                                {/* Category */}

                                <div className="form-group">
                                    <label>Category</label>

                                    <select
                                        name="category"
                                        value={skillItem.category}
                                        onChange={(e) =>
                                            handleChange(index,e)
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select Category
                                        </option>

                                        <option value="Frontend">
                                            Frontend
                                        </option>

                                        <option value="Backend">
                                            Backend
                                        </option>

                                        <option value="Database">
                                            Database
                                        </option>

                                        <option value="Programming">
                                            Programming
                                        </option>

                                        <option value="DevOps">
                                            DevOps
                                        </option>

                                        <option value="Testing">
                                            Testing
                                        </option>

                                        <option value="Tools">
                                            Tools
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>
                                    </select>
                                </div>


                                {/* Proficiency */}

                                <div className="form-group">
                                    <label>Proficiency</label>

                                    <select
                                        name="proficiency"
                                        value={skillItem.proficiency}
                                        onChange={(e) =>
                                            handleChange(index,e)
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select Proficiency
                                        </option>

                                        <option value="Beginner">
                                            Beginner
                                        </option>

                                        <option value="Intermediate">
                                            Intermediate
                                        </option>

                                        <option value="Advanced">
                                            Advanced
                                        </option>

                                        <option value="Expert">
                                            Expert
                                        </option>
                                    </select>
                                </div>


                                {/* Experience */}

                                <div className="form-group">
                                    <label>Experience</label>

                                    <select
                                        name="experience"
                                        value={skillItem.experience}
                                        onChange={(e) =>
                                            handleChange(index,e)
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select Experience
                                        </option>

                                        <option value="Less than 1 year">
                                            Less than 1 year
                                        </option>

                                        <option value="1-2 years">
                                            1-2 years
                                        </option>

                                        <option value="2-4 years">
                                            2-4 years
                                        </option>

                                        <option value="4-6 years">
                                            4-6 years
                                        </option>

                                        <option value="6+ years">
                                            6+ years
                                        </option>
                                    </select>
                                </div>

                            </div>

                        </div>
                    ))}

                </div>


                {/* Primary Skills */}

                <div className="primary-skills-info">

                    <h3>Primary Skills</h3>

                    <p>
                        Your primary skills are the technologies or
                        areas in which you have the strongest expertise.
                    </p>

                    <div className="primary-skills-list">

                        {skills
                            .filter((item) => item.skill)
                            .map((item,index) => (
                                <span key={index}>
                                    {item.skill}
                                </span>
                            ))}

                    </div>

                </div>


                {/* Actions */}

                <div className="form-actions">

                    <button type="submit">
                        Save Skills
                    </button>

                </div>

            </form>

        </div>
    );
};

export default Skills;
