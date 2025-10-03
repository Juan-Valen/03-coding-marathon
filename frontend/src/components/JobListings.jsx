import { useEffect, useState } from "react";
import JobListing from "./JobListing";

const JobListings = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch('/api/jobs');
                const data = await res.json();
                setJobs(data);
            } catch (err) {
                console.error("Failed to fetch jobs: ", err);
            }
        };

        fetchJobs();
    }, [])
    return (
        <div className="job-list">
            {jobs.length === 0 && <p>No jobs found</p>}
            {jobs.length !== 0 &&
                jobs.map((job) => <JobListing key={job.id} job={job} />)}
        </div>
    );
};

export default JobListings;
