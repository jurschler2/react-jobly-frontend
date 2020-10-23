import React, { useState, useContext } from "react";
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

// Renders a login page for the user to login or signup.
function Login({ addLogin, addRegistration }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showRegistration, setShowRegistration] = useState(false);

  // Get the token from context.
  const { token } = useContext(LoginToken);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  };

  function handleLoginSubmit(evt) {
    evt.preventDefault();
    addLogin(formData);
  }
  function handleRegistrationSubmit(evt) {
    evt.preventDefault();
    addRegistration(formData);
  }

  // Toggle between the login and registration forms
  function formToggle(evt) {
    evt.preventDefault();
    setShowRegistration((old) => !old);
  }

  const renderLoginHTML = () => {
    return (
      <form action="" onSubmit={handleLoginSubmit}>
        <label htmlFor="username">Username:</label>
        <br />
        <input
          name="username"
          onChange={handleChange}
          value={formData.username}
        />
        <br />

        <label htmlFor="password">Password:</label>
        <br />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />
        <br />

        <button>Submit</button>
      </form>
    );
  };

  const renderRegistrationHTML = () => {
    return (
      <form action="" onSubmit={handleRegistrationSubmit}>
        <label htmlFor="username">Username:</label>
        <br />
        <input
          name="username"
          onChange={handleChange}
          value={formData.username}
        />
        <br />

        <label htmlFor="password">Password:</label>
        <br />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />
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

        <label htmlFor="photo_url">Photo:</label>
        <br />
        <input
          name="photo_url"
          onChange={handleChange}
          value={formData.photo_url}
        />
        <br />

        <button>Submit</button>
      </form>
    );
  };

  return (
    // If logged in, redirect to the homepage, else render a form to login or register.
    <div>
      {token ? (
        <Redirect to="/" />
      ) : (
        <div>
          <button onClick={formToggle}>
            {showRegistration ? "Login" : "Register"}
          </button>
          {showRegistration ? renderRegistrationHTML() : renderLoginHTML()}
        </div>
      )}
    </div>
  );
}

export default Login;
