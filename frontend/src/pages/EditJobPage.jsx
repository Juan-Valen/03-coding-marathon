import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditJobPage = () => {
    const { id } = useParams();
    const [form, setForm] = useState({ title: "", type: "", description: "", companyName: "", contactPhone: "", contactEmail: "", website: "", size: 0, location: "", salary: 0, experienceLevel: "", postedDate: "", status: "", applicationDeadline: "", requirements: [] })

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    const navigate = useNavigate();

    const updateJob = async (job) => {
        try {
            const res = await fetch(`/api/jobs/${job.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(job),
            });
            if (!res.ok) throw new Error("Failed to update job");
            return res.ok;
        } catch (error) {
            console.error("Error updating job:", error);
            return false;
        }
    };

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`/api/jobs/${id}`);
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await res.json();

                // Initialize form fields with fetched job data
                setForm({ title: data.title, type: data.type, description: data.description, companyName: data.company.name, contactEmail: data.company.contactEmail, contactPhone: data.company.contactPhone, website: data.company.website, size: data.company.size, location: data.localtion, salary: data.salary, experienceLevel: data.experienceLevel, postedDate: Date.parse(data.postedDate), status: data.status, applicationDeadline: data.applicationDeadline, requirements: data.requirements })
            } catch (error) {
                console.error("Failed to fetch job:", error);
                toast.error("Failed to fetch job");
            }
        };

        fetchJob();
    }, [id]);

    const submitForm = async (e) => {
        e.preventDefault();

        const updatedJob = {
            id,
            ...form,
            company: {
                name: form.companyName,
                contactEmail: form.contactEmail,
                contactPhone: form.contactPhone,
                website: form.website,
                size: form.size
            },
        };

        const success = await updateJob(updatedJob);
        if (success) {
            toast.success("Job Updated Successfully");
            navigate(`/jobs/${id}`);
        } else {
            toast.error("Failed to update the job");
        }
    };

    return (
        <div className="create">
            <h2>Update Job</h2>

            <form onSubmit={submitForm}>
                <label>Job title:</label>
                <input
                    type="text"
                    required
                    id="title" value={form.title}
                    onChange={handleChange}/>
                <label>Job type:</label>
                <select
                    id="type" value={form.type}
                    onChange={handleChange}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                </select>
                <label>Job Description:</label>
                <textarea
                    required
                    id="description" value={form.description}
                    onChange={handleChange}></textarea>
                <label>Company Name:</label>
                <input
                    type="text"
                    required
                    id="companyName" value={form.companyName}
                    onChange={handleChange}/>
                <label>Contact Email:</label>
                <input
                    type="text"
                    required
                    id="contactEmail" value={form.contactEmail}
                    onChange={handleChange}/>
                <label>Contact Phone:</label>
                <input
                    type="text"
                    required
                    id="contactPhone" value={form.contactPhone}
                    onChange={handleChange}/>
                <label>Website:</label>
                <input
                    type="text"
                    id="website" value={form.website}
                    onChange={handleChange}/>
                <label>Size:</label>
                <input
                    type="number"
                    id="size" value={form.size}
                    onChange={handleChange}/>
                <label>Location:</label>
                <input
                    type="text"
                    id="location" value={form.location}
                    onChange={handleChange}/>
                <label>Salary:</label>
                <input
                    type="text"
                    id="salary" value={form.salary}
                    onChange={handleChange}/>
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
                    onChange={handleChange}/>
                <label>requirements:</label>
                <input
                    type="text"
                    id="requirements" value={form.requirements}
                    onChange={handleChange} />
                <button>Update Job</button>
            </form>
        </div>
    );
};

export default EditJobPage;
