import React, { useState } from "react";
import { debounce } from 'lodash';

// Renders a search bar that enables a user to search.
function Search({ addQuery }) {
  const [formData, setFormData] = useState({
    query: "",
  });

  // FS, TODO: programming technique called debouncing
  // A function that you have wrapped so that is pauses x amount of time between calls before running again

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
    const submitQuery = () => addQuery(formData.query);
    const debouncer = debounce(submitQuery, 500);
    debouncer();
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    addQuery(formData.query);
  }

  return (
    <form action="" onSubmit={handleSubmit}>
      <label htmlFor="query">Search:</label>
      <input name="query" onChange={handleChange} value={formData.query} />
      <button>Submit</button>
    </form>
  );
}

export default Search;

