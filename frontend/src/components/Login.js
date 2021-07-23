import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const api = "http://localhost:5000/login";

export default function Login () {

  const history = useHistory();

  const [ email, setEmail ] = useState("");
  const [ pass, setPassword ] = useState("");
  const [ errors, setErrors ] = useState([]);
  
  const { userState, setUserState } = useContext(UserContext);

  const submit = () => {
    axios.post(api, { emailAddress: email, password: pass }, {withCredentials: true, credentials: "include"})
    .then(res => {
        localStorage.setItem("jwt", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUserState(res.data.user);
        console.log(userState);
        history.push({
          pathname: `/user/account/${res.data.user._id}` 
       });
    })
    .catch(error => setErrors(error.response.data.error));
    console.log(errors)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit()
  }

  return (
    <div >
        <h1>tinder</h1>
      <p className="Errors">{errors}</p>
      <form onSubmit={handleSubmit}>
        <input
          id="emailAddress"
          name="emailAddress"
          type="text"
          placeholder="emailAddress"
          className="Login-input"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className="Login-input"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
        <button type="submit" className="Login-button">Submit</button>
        </div>
      </form>
      <p>Don't have a user account?
        <Link to="/user/create-account" > Click here </Link>
        to sign up!
      </p>
    </div>
  );
}
