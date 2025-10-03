import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const JobPage = ({ isAuthenticated }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const website = import.meta.env.VITE_API_URL || "";

    const deleteJob = async (id) => {
        try {
            const res = await fetch(`${website}/api/jobs/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                throw new Error("Failed to delete job");
            }
            return true;
        } catch (error) {
            console.error("Error deleting job:", error);
            throw error; // Re-throw the error so onDeleteClick can catch it
        }
    };

    useEffect(() => {
        const fetchJob = async () => {
            try {
                console.log("id: ", id);
                const res = await fetch(`${website}/api/jobs/${id}`);
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await res.json();
                setJob(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const onDeleteClick = async (jobId) => {
        const confirm = window.confirm(
            "Are you sure you want to delete this listing?" + jobId
        );
        if (!confirm) return;

        try {
            await deleteJob(jobId);
            console.log("Job deleted successfully");
            navigate("/");
        } catch (error) {
            console.error("Failed to delete job:", error);
        }
    };

    return (
        <div className="job-preview">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <div>
                        <h2>{job.title}</h2>
                        <p className={job.status}>{job.status}</p>
                        <p>{job.type}</p>
                        <p>Deadline: {job.applicationDeadline}</p>
                        <p>Posted: {job.postedDate}</p>
                    </div>
                    <div>
                        <p>Email: {job.company.contactEmail}</p>
                        <p>Phone: {job.company.contactPhone}</p>
                        <p>Website: {job.company.website}</p>
                        <p>Size: {job.company.size}</p>
                        <p>Location: {job.location}</p>
                    </div>
                    <p>Company: {job.company.name}</p>
                    <p>Salary: {job.salary}</p>
                    <p>Experience Level: {job.experienceLevel}</p>
                    <div>
                        <p><strong>Requirements:</strong></p>
                        {job.requirements.length === 0 && <p>No specific requirements listed</p>}
                        {job.requirements.length !== 0 &&
                            <ul>
                                {job.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                ))}
                            </ul>
                        }
                    </div>
                    <p>Description: {job.description}</p>
                    <button onClick={() => onDeleteClick(job._id)}>delete</button>
                    <button onClick={() => navigate(`/edit-job/${job._id}`)}>edit</button>

                </>
            )}
        </div>
    );
};

export default JobPage;
