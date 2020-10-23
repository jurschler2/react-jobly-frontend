import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Companies from "./Companies";
import Navigation from "./Navigation";
import Company from "./Company";
import Home from "./Home";
import Jobs from "./Jobs";
import Login from "./Login";
import Profile from "./Profile";
import { v4 as uuid } from "uuid";
import JoblyApi from "./JoblyAPI";
import LoginToken from "./loginToken";
// import GlobalUser from "./globalUser";

// Routes for the Jobly frontend
function Routes() {
  const [loginInfo, setLoginInfo] = useState();
  const [registrationInfo, setRegistrationInfo] = useState();
  const [editProfileInfo, setEditProfileInfo] = useState();
  const [token, setToken] = useState("");
  const [username, setUsername] = useState();
  const [user, setUser] = useState();

  // Get auth / login token by login state (username, password)
  // Set the login token to local storage on successful login, else set state
  // 'token' to existing local storage token value.
  useEffect(
    function doAuth() {
      async function getTokenAPI() {
        let currentUserToken;
        let currentUsername;

        // To remove the localStorage key name 'token' and place in a config file and rename
        // with a more consistent and obvious name. An example of defensive programming

        // If login attempt made and we have loginInfo (username, password) from form
        if (loginInfo) {
          currentUserToken = await JoblyApi.login(
            loginInfo.username,
            loginInfo.password
          );

          if (currentUserToken) currentUsername = loginInfo.username;

          setToken(currentUserToken);
          setUsername(currentUsername);
          // TODO: store only token, extract username from token
          // Decode payload with JWT, don't need to verify!
          // TODO: try to differentiate localStorage names vs state names vs context
          localStorage.setItem("token", currentUserToken);
          localStorage.setItem("username", currentUsername);

          // If just loading a page/route, rather than logging in
        } else {
          // If we have a token in localStorage (logged in in localStorage)
          if (localStorage["token"] && localStorage["username"]) {
            // Set token context when found token in localStorage
            setToken(localStorage["token"]);
            setUsername(localStorage["username"]);
          }

          // If register attempt made and we have registrationInfo (username, password, ...) from form
          if (registrationInfo) {
            currentUserToken = await JoblyApi.register(registrationInfo);

            if (currentUserToken) currentUsername = loginInfo.username;

            setToken(currentUserToken);
            setUsername(currentUsername);
            localStorage.setItem("token", currentUserToken);
            localStorage.setItem("username", currentUsername);
          }
        }
        return <Redirect to="/" />;
      }
      getTokenAPI();
    },
    [loginInfo, registrationInfo]
  );

  // UPDATE USER on editProfileInfo change
  useEffect(
    function updateProfilApi() {
      async function updateProfile() {
        if (token && editProfileInfo) {
          let res = await JoblyApi.updateUser(
            editProfileInfo.username,
            editProfileInfo,
            token
          );
          setUsername(res.username);
          setUser(res);
          localStorage.setItem("username", res.username);
        }
        return <Redirect to="/" />;
      }
      updateProfile();
    }, [token, editProfileInfo]);

  // GET USER on page load
  useEffect(
    function populateUser(){
      async function getUserAPI() {
        if (token && username) {
          let currentUser = await JoblyApi.getUser(username, token);
          setUser(currentUser);
        }
      }
      getUserAPI();
    }, [token, username]);

  // Set token/user in localStorage and context to "" and null
  const logOut = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("user", null);
    setToken("");
    setUsername("");
  };

  // Set loginInfo credentials state from Login component
  const addLogin = (data) => {
    let newLogin = { ...data, id: uuid() };
    setLoginInfo(newLogin);
  };

  // Set registrationInfo credentials state from Login component
  const addRegistration = (data) => {
    let newRegistration = { ...data, id: uuid() };
    setRegistrationInfo(newRegistration);
  };

  // Set editProfileInfo credentials state from Profile component
  const addEditProfileInfo = (data) => {
    let newEdit = { ...data, id: uuid() };
    setEditProfileInfo(newEdit);
  };

  return (
    <LoginToken.Provider value={{ token }}>
      <Navigation logOut={logOut} />
      <Switch>
        <Route exact path="/companies">
          <Companies />
        </Route>
        <Route exact path="/companies/:company" >
          <Company user={user} />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/jobs">
          <Jobs user={user} />
        </Route>
        <Route exact path="/login">
          <Login addLogin={addLogin} addRegistration={addRegistration} />
        </Route>
        <Route exact path="/profile">
          <Profile addEditProfileInfo={addEditProfileInfo} user={user} />
        </Route>
        <Redirect to="/" />
      </Switch>
    </LoginToken.Provider>
  );
}

export default Routes;
