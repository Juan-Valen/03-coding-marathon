import { Link } from "react-router-dom";

const JobListing = ({ job }) => {
    return (
        <div className="job-preview" key={job.id}>
            <Link to={`/jobs/${job.id}`}>
                <h2>{job.title}</h2>
            </Link>
            <p>Type: {job.type}</p>
            <p>Company: {job.company.name}</p>
        </div>
    );
};

export default JobListing;
