import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001"

// Class to centralize and simplify backend API interactions for React frontend.
class JoblyApi {
  static async request(endpoint, paramsOrData = {}, verb = "get") {
    // paramsOrData._token = // for now, hardcode token for "testing"
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc" +
    //   "3RpbmciLCJpc19hZG1pbiI6ZmFsc2UsImlhdCI6MTU1MzcwMzE1M30." +
    //   "COmFETEsTxN_VfIlgIKw0bYJLkvbRQNgO1XCSE8NZ0U";

    console.debug("API Call:", endpoint, paramsOrData, verb);

    try {
      return (
        await axios({
          method: verb,
          url: `${BASE_URL}/${endpoint}`,
          [verb === "get" ? "params" : "data"]: paramsOrData,
        })
      ).data;
      // axios sends query string data via the "params" key,
      // and request body data via the "data" key,
      // so the key we need depends on the HTTP verb
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async getCompany(handle, token) {
    let res = await this.request(`companies/${handle}`, { _token: token });
    return res.company;
  }

  static async getCompanies(query = "", token) {
    let res = await this.request(`companies`, { search: query, _token: token });
    return res.companies;
  }

  static async getJobs(query = "", token) {
    let res = await this.request(`jobs`, { search: query, _token: token });
    return res.jobs;
  }

  static async login(username, password) {
    let res = await this.request(`login`, { username, password }, "post");
    return res.token;
  }

  static async register({
    username,
    password,
    first_name,
    last_name,
    email,
    photo_url = "",
  }) {
    if (!photo_url) photo_url = undefined;
    let res = await this.request(
      `users`,
      { username, password, first_name, last_name, email, photo_url },
      "post"
    );
    return res.token;
  }

  static async getUser(username, token) {
    let res = await this.request(`users/${username}`, { _token: token });
    return res.user;
  }

  static async updateUser(username, data, token) {
    data._token = token;
    delete data.jobs;
    delete data.username;
    delete data.id;
    if (!data.photo_url) data.photo_url = undefined;
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  static async apply(id, token) {
    let res = await this.request(`jobs/${id}/apply`, { _token: token }, "post");
    return res;
  }
}

export default JoblyApi;
