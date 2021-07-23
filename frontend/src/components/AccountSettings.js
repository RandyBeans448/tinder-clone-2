import React, { useState, useContext } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Header from "./Header";
import axios from "axios";

import { UserContext } from "../Context/UserContext";

export default function AccountSettings() {

  const history = useHistory();

  const { userState, setUserState } = useContext(UserContext);
  const [firstName, setFirstName] = useState(userState.firstName);
  const [lastName, setLastName] = useState(userState.lastName);
  const [description, setDescription] = useState(userState.description);
  const [errors, setErrors] = useState([])

  const submit = () => {

    const data = {
      firstName: firstName,
      lastName: lastName,
      description: description,
    };

    console.log(data, "data")

    axios
      .patch(
        `http://localhost:5000/user/settings/${userState._id}`, data,
        {
          headers: {
            Authorization: localStorage.getItem("jwt"),
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        },
      )
      .then((res) => {
        console.log(res.data)
        history.push({
          pathname: `/user/account/${userState._id}`,
        });
      })
      .catch(error => setErrors(error.response.data.error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

  return (
    <div>
      <Header />
      <div>
        <h1>Settings</h1>
      </div>
      <p className="Errors">{errors}</p>
      <form onSubmit={handleSubmit}>
        <input
          id="firstName"
          name="firstName"
          type="firstName"
          onChange={(e) => setFirstName(e.target.value)}
          className="Sign-up-input"
          defaultValue={firstName}
        ></input>
        <input
          id="lastName"
          name="lastName"
          type="lastName"
          onChange={(e) => setLastName(e.target.value)}
          className="Sign-up-input"
          defaultValue={lastName}
        ></input>
        <textarea
          id="description"
          name="description"
          type="description"
          onChange={(e) => setDescription(e.target.value)}
          className="Sign-up-text"
          defaultValue={description}
        ></textarea>
        <div className="Submit-box">
          <div className="Submit-sub-box">
            <p>Submit</p>
            <button type="submit" className="Submit-button">
              <IconButton>
                <CheckCircleIcon fontSize="large">
                  <button></button>
                </CheckCircleIcon>
              </IconButton>
            </button>
          </div>
          <div className="Submit-sub-box">
            <p>Cancel</p>
            <Link to={`/user/account/${userState._id}`}>
              <IconButton>
                <HighlightOffIcon fontSize="large"></HighlightOffIcon>
              </IconButton>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}