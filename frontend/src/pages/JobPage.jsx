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
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
                }
            });
            if (!res.ok) {
                throw new Error("Failed to delete job");
            }
        } catch (error) {
            console.error("Error deleting job:", error);
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

    const onDeleteClick = (jobId) => {
        const confirm = window.confirm(
            "Are you sure you want to delete this listing?" + jobId
        );
        if (!confirm) return;

        deleteJob(jobId);
        navigate("/");
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
                    <p>Requirements:
                        {job.requirements.length === 0 && <p></p>}
                        {job.requirements.length !== 0 &&
                            job.requirements.map(req => req + "   ")}
                    </p>
                    <p>Description: {job.description}</p>
                    {isAuthenticated &&
                        <>
                            <button onClick={() => onDeleteClick(job._id)}>delete</button>
                            <button onClick={() => navigate(`/edit-job/${job._id}`)}>edit</button>
                        </>
                    }

                </>
            )}
        </div>
    );
};

export default JobPage;
