import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddJobPage = () => {
    const [form, setForm] = useState({ title: "", type: "", description: "", companyName: "", contactPhone: "", contactEmail: "", website: "", size: 0, location: "", salary: 0, experienceLevel: "", postedDate: "", status: "", applicationDeadline: "", requirements: [] })
    const navigate = useNavigate();
    const website = import.meta.env.VITE_API_URL || "";
    async function addJob() {

        const postData = {
            ...form,
            company: {
                name: form.companyName,
                contactEmail: form.contactEmail,
                contactPhone: form.contactPhone,
                website: form.website,
                size: form.size
            }
        }

        try {
            const res = await fetch(`${website}/api/jobs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData)
            });

            if (res.ok) {
                console.log("Job added successfully!");
                navigate("/")
            } else {
                console.error("POST FAILED!");

            }
        } catch (error) {
            console.error("catch error:", error);
        }
    }

    const submitForm = (e) => {
        e.preventDefault();
        addJob();
        console.log("submitForm called");

    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleRequirement = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, ["requirements"]: [...prev.requirements.map((r, i) => i != name ? r : value)] }));
    };

    const handleAddRequirement = (e) => {
        setForm((prev) => ({ ...prev, ["requirements"]: [...prev.requirements, ""] }));
    };

    const handleDeleteRequirement = (index, e) => {
        setForm((prev) => ({ ...prev, ["requirements"]: [...prev.requirements.filter((_, i) => i != index)] }));
    };

    return (
        <div className="create">
            <h2>Add a New Job</h2>
            <form onSubmit={submitForm}>
                <label>Job title:</label>
                <input
                    id="title"
                    type="text"
                    required
                    value={form.title}
                    onChange={handleChange} />
                <label>Job type:</label>
                <select
                    id="type"
                    value={form.type}
                    onChange={handleChange}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                </select>
                <label>Job Description:</label>
                <textarea
                    id="description"
                    required
                    value={form.description}
                    onChange={handleChange}></textarea>
                <label>Company Name:</label>
                <input
                    id="companyName"
                    type="text"
                    required
                    value={form.companyName}
                    onChange={handleChange} />
                <label>Contact Email:</label>
                <input
                    id="contactEmail"
                    type="text"
                    required
                    value={form.contactEmail}
                    onChange={handleChange} />
                <label>Contact Phone:</label>
                <input
                    id="contactPhone"
                    type="text"
                    required
                    value={form.contactPhone}
                    onChange={handleChange} />
                <label>Website:</label>
                <input
                    type="text"
                    id="website" value={form.website}
                    onChange={handleChange} />
                <label>Size:</label>
                <input
                    type="number"
                    id="size" value={form.size}
                    onChange={handleChange} />
                <label>Location:</label>
                <input
                    type="text"
                    id="location" value={form.location}
                    onChange={handleChange} />
                <label>Salary:</label>
                <input
                    type="text"
                    id="salary" value={form.salary}
                    onChange={handleChange} />
                <label>experienceLevel:</label>
                <select
                    id="experienceLevel" value={form.experienceLevel}
                    onChange={handleChange}>
                    <option disabled></option>
                    <option value="Entry">Entry</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                </select>
                <label>status:</label>
                <select
                    id="status" value={form.status}
                    onChange={handleChange}>
                    <option disabled></option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
                <label>applicationDeadline:</label>
                <input
                    type="date"
                    id="applicationDeadline" value={form.applicationDeadline}
                    onChange={handleChange} />
                <label>requirements:</label>
                <div className="req-list">
                    {form.requirements.length === 0 && <p></p>}
                    {form.requirements.length !== 0 &&
                        form.requirements.map((reqt, index) =>
                            <div className="req-item" key={"requirements " + reqt.index}>
                                <input name={index} type="text" required
                                    value={reqt}
                                    onChange={handleRequirement} />
                                <button type="button" onClick={(e) => handleDeleteRequirement(index, e)}>delete</button>
                            </div>
                        )}
                    <button onClick={handleAddRequirement} type="button">add requirement</button>
                </div>
                <button>Add Job</button>
            </form>
        </div>
    );
};

export default AddJobPage;
