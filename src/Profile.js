import React, { useState, useContext, useEffect } from "react";
import LoginToken from "./loginToken";
import { Redirect } from "react-router-dom";

const INITIAL_STATE = {
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  email: "",
  photo_url: "",
};

// Renders a specific user's profile with the ability to update that user's information.
function Profile({ addEditProfileInfo, user }) {
  const { token } = useContext(LoginToken);
  // Spreading prevents changing INITIAL_STATE by changing formData!!!!
  const [formData, setFormData] = useState({ ...INITIAL_STATE });

  // Update form data on user object change (user populated)
  useEffect(
    function updateProfileForm() {
      async function updateFormData() {
        if (token && user) {
          let copyOfUser = { ...user, password: "" };
          if (!copyOfUser.photo_url) copyOfUser.photo_url = "";
          setFormData(copyOfUser);
        }
      }
      updateFormData();
    }, [token, user]);

  // If not logged in, redirect to home
  if (!localStorage["token"] && !token) {
    return <Redirect to="/" />;
  }

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    addEditProfileInfo(formData);
  }

  // JSX / HTML for the edit profile form
  const renderEditProfileHTML = () => {
    return (
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <br />
        <input name="username" value={formData.username} disabled="disabled" />
        <br />

        <label htmlFor="first_name">First Name:</label>
        <br />
        <input
          name="first_name"
          onChange={handleChange}
          value={formData.first_name}
        />
        <br />

        <label htmlFor="last_name">Last Name:</label>
        <br />
        <input
          name="last_name"
          onChange={handleChange}
          value={formData.last_name}
        />
        <br />

        <label htmlFor="email">Email:</label>
        <br />
        <input name="email" onChange={handleChange} value={formData.email} />
        <br />

        <label htmlFor="photo_url">Photo URL:</label>
        <br />
        <input
          name="photo_url"
          onChange={handleChange}
          value={formData.photo_url}
        />
        <br />

        <label htmlFor="password">Re-enter Password:</label>
        <br />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />
        <br />

        <button>Save Changes</button>
      </form>
    );
  };

  return <div>{renderEditProfileHTML()}</div>;
}

export default Profile;
