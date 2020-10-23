import React, { useState, useEffect, useContext } from "react";
import Search from "./Search";
import CompanyCard from "./CompanyCard";
import JoblyApi from "./JoblyAPI";
import { v4 as uuid } from "uuid";
import LoginToken from "./loginToken";
import { Redirect } from "react-router-dom";

// Renders a list of companies; shows a search bar and each company card
function Companies() {
  const { token } = useContext(LoginToken);
  const [companiesAPI, setCompaniesAPI] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
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
  // Get companies by search query (default query is "" for all companies!)
  useEffect(
    function populateCompaniesAPI() {
      async function getCompaniesAPI() {
        if (token) {
          const companies = await JoblyApi.getCompanies(query, token);
          setCompaniesAPI(companies);
        }
      }
      getCompaniesAPI();
    }, [query, token]);

   // If not logged in, redirect to home
   if (!isLoading && !token) {
    return <Redirect to="/" />;
  }

  // Set query state from Search component
  // Andrei: Try to disable feature of autoformat ()
  const addQuery = (query) => {
    setQuery(query);
  };

  let companyCardList = companiesAPI.map((c) => (
    <CompanyCard key={uuid()} company={c} />
  ));
  return (
    <div>
      Companies
      <Search addQuery={addQuery} />
      {companyCardList}
    </div>
  );
}

export default Companies;
