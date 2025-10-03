import { useEffect, useState } from "react";
import JobListing from "./JobListing";

const JobListings = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            const apiUrl = '/api/jobs';
            try {
                const res = await fetch(apiUrl);
                const data = await res.json();
                setJobs(data);
            } catch (error) {
                console.log('Error fetching data', error);
            }
        };

        fetchJobs();
    }, []);

    return (
        <section className='bg-blue-50 px-4 py-10'>
            <div className='container-xl lg:container m-auto'>
                <h2 className='text-3xl font-bold text-indigo-500 mb-6 text-center'>
                </h2>

                {
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {jobs.map((job) => (
                            <JobListing key={job.id} job={job} />
                        ))}
                    </div>
                }
            </div>
        </section>
    );
};

export default JobListings;
