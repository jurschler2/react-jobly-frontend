import React from "react";

// Renders an individual job detail card.
function JobCard({ job, jobs, applyForJob }) {
  return (
    <div>
      <h4>{job.title}</h4>
      <p>Salary: {job.salary}</p>
      <p>Equity: {job.equity}</p>
      {jobs.includes(job.id) ? (
        <p>applied</p>
      ) : (
        <button onClick={() => applyForJob(job.id)}>Apply</button>
      )}
    </div>
  );
}

export default JobCard;
