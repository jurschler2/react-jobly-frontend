import React, { useState, useEffect, useContext } from "react";
import JobCard from "./JobCard";
import Search from "./Search";
import JoblyApi from "./JoblyAPI";
import LoginToken from "./loginToken";
import { Redirect } from "react-router-dom";

function Jobs({ user }) {
  const { token } = useContext(LoginToken);
  const [jobsAPI, setJobsAPI] = useState([]);
  const [query, setQuery] = useState("");
  const [appliedJobsIds, setAppliedJobsIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlyUserJobs, setShowOnlyUserJobs] = useState(false);
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

  // Get jobs by search query (default query is "" for all jobs!)
  useEffect(
    function populateJobs() {
      async function getJobsAPI() {
        if (token && user && user.jobs) {
          const jobs = await JoblyApi.getJobs(query, token);
          setJobsAPI(jobs);
        }
      }
      getJobsAPI();
    }, [user, query, token]);

  // Get jobs user has applied for on page load
  useEffect(
    function populateUser() {
      async function getUserAPI() {
        if (token && user) {
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

  // TODO: find a way to not check localStorage and not redirect
  // If not logged in, redirect to home
  if (!isLoading && !token) {
    return <Redirect to="/" />;
  }

  // Set query state from Search component
  const addQuery = (query) => {
    setQuery(query);
  };

  let allJobsHTML = jobsAPI.map((j, idx) => (
    <JobCard
      key={idx}
      job={j}
      jobs={appliedJobsIds}
      applyForJob={applyForJob}
    />
  ));

  let userJobsHTML = jobsAPI.filter(j => appliedJobsIds.includes(j.id)).map((j, idx) => (
    <JobCard
      key={idx}
      job={j}
      jobs={appliedJobsIds}
      applyForJob={applyForJob}
    />
  ));

  const toggleShowJobs = () => {
    setShowOnlyUserJobs(old => !old);
  }

  return (
    <div>
      Jobs
      <Search addQuery={addQuery} />
      <button onClick={toggleShowJobs}>{showOnlyUserJobs ? "View all jobs" : "View my jobs"}</button>
      {showOnlyUserJobs 
        ? userJobsHTML
        : allJobsHTML
      }
    </div>
  );
}

export default Jobs;
