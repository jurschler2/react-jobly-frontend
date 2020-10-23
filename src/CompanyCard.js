import React from "react";
// import Alert from "./Alert";
import { Link } from "react-router-dom";

// Renders an indivual company detail card.
function CompanyCard({ company }) {
  return (
    <div>
      <Link to={`companies/${company.handle}`}>
        <h4>{company.name}</h4>
      </Link>
      <p>{company.description}</p>
      <img src={company.logo_url} alt="no icon provided" />
    </div>
  );
}

export default CompanyCard;
