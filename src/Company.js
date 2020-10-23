import React, { useState, useEffect, useContext } from "react";
import JobCard from "./JobCard";
import JoblyApi from "./JoblyAPI";
import { v4 as uuid } from "uuid";
import LoginToken from "./loginToken";
import { useParams, Redirect, Link } from "react-router-dom";

// Renders an indiviual company's details with its list of jobs.
function Company({user}) {
  const { token } = useContext(LoginToken);
  const handle = useParams().company;
  const [companyAPI, setCompanyAPI] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [appliedJobsIds, setAppliedJobsIds] = useState([]);
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);

  // Sets the isloading state to false when token is received or if token remains an empty string
  useEffect(
    function loadingScreen() {
      async function updateIsLoading() {
        if (token || token === "") {
          setIsLoading(false);
        }
      }
      updateIsLoading();
    }, [token])
  // Get company by handle
  useEffect(
    function populateCompanyAPI() {
      async function getCompanyAPI() {
        const company = await JoblyApi.getCompany(handle, token);
        setCompanyAPI(company);
      }
      getCompanyAPI();
    }, [handle, token]);

  // Get jobs user has applied for on page load
  useEffect(
    function populateUser() {
      async function getUserAPI() {
        if (token && user && user.jobs) {
          let jobIds = [];
          user.jobs.map((job) => jobIds.push(job.id));
          setAppliedJobsIds(jobIds);
          setAppliedJobsCount(jobIds.length);
        }
      }
      getUserAPI();
    }, [token, user]);  
  // POST TO JOBS/ID/APPLY to APPLY FOR JOB after clicking apply
  useEffect(
    function applyToJobApi() {
      async function applyJobApi() {
        if (token && user && appliedJobsIds.length) {
          if (appliedJobsIds.length !== appliedJobsCount) {
          // JANKY SOLUTION ASK ABOUT THIS
            await JoblyApi.apply(appliedJobsIds[appliedJobsIds.length - 1], token);
          }
        }
      }
      applyJobApi();
    }, [token, user, appliedJobsIds, appliedJobsCount]);

  // Set loginInfo credentials state from Login component
  const applyForJob = (id) => {
    setAppliedJobsIds((oldJobs) => [...appliedJobsIds, id]);
  };
  // If not logged in, redirect to home
  if (!isLoading && !token) {
    return <Redirect to="/" />;
  }

  let jobsHTML;
  if (companyAPI) {
    jobsHTML = companyAPI.jobs.map((j) => <JobCard key={uuid()} job={j} jobs={appliedJobsIds} applyForJob={applyForJob} />);
  } else {
    jobsHTML = null;
  }

  return (
    <div>
      <Link to="/companies">Back</Link>
      <h2>{companyAPI ? companyAPI.name : null}</h2>
      {jobsHTML}
    </div>
  );
}

export default Company;
