import React, { useState, useContext } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Header from "./Header";
import axios from "axios";

import { UserContext } from "../Context/UserContext";

export default function AccountSettings() {
  const { id } = useParams();

  const history = useHistory();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sexualPreference, setSexualPreference] = useState("");
  const [description, setDescription] = useState("");

  const { userState } = useContext(UserContext);

  console.log(userState);

  const submit = () => {
    axios
      .patch(
        `http://localhost:5000/user/settings/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("jwt"),
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        },
        {
          firstName: firstName,
          lastName: lastName,
          sexualPreference: sexualPreference,
          description: description,
        }
      )
      .then((res) => {
        // const data = res.data.updateObject;
        history.push({
          pathname: `/user/account/${id}`,
        });
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (event) => {
    console.log(id);
    event.preventDefault();
    submit();
  };

  return (
    <div>
      <Header />
      <div>
        <h1>Settings</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          id="firstName"
          name="firstName"
          type="firstName"
          onChange={(e) => setFirstName(e.target.value)}
          className="Sign-up-input"
          defaultValue={userState.firstName}
        ></input>
        <input
          id="lastName"
          name="lastName"
          type="lastName"
          onChange={(e) => setLastName(e.target.value)}
          className="Sign-up-input"
          defaultValue={userState.lastName}
        ></input>
        <input
          id="sexualPreference"
          name="sexualPreference"
          type="sexualPreference"
          onChange={(e) => setSexualPreference(e.target.value)}
          className="Sign-up-input"
          defaultValue={userState.sexualPreference}
        ></input>
        <textarea
          id="description"
          name="description"
          type="description"
          onChange={(e) => setDescription(e.target.value)}
          className="Sign-up-text"
          defaultValue={userState.description}
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
            <Link to={`/user/account/${id}`}>
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