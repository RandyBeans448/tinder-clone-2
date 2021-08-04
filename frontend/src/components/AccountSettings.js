import React, { useState, } from "react";
import { Link,  useHistory } from "react-router-dom";

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment'
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Header from "./Header";
import axios from "axios";

export default function AccountSettings() {

  const history = useHistory();

  const local = localStorage.getItem("user");
  const localUser = JSON.parse(local);

  const [firstName, setFirstName] = useState(localUser.firstName);
  const [lastName, setLastName] = useState(localUser.lastName);
  const [description, setDescription] = useState(localUser.description);
  const [errors, setErrors] = useState([]);

  const submit = () => {

    const data = {
      firstName: firstName,
      lastName: lastName,
      description: description,
    };

    axios
      .patch(
        `http://localhost:5000/user/settings/${localUser._id}`, data,
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
          pathname: `/user/account/${localUser._id}`,
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
      <p className="Errors">{errors}</p>
      <div className="Account-page-container">
      <Card className="Account-page-wrapper">
        <CardContent>
      <Typography gutterBottom variant="h5" component="h1">
               Settings
              </Typography>
              <InputLabel htmlFor="standard-adornment-amount">Fist name</InputLabel>
          <Input
            id="standard-adornment-amount"
            // value={values.amount}
            // onChange={handleChange('amount')}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
              </CardContent>
      </Card>
      </div>
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
      <p>First name</p>
        <input
          id="firstName"
          name="firstName"
          type="firstName"
          onChange={(e) => setFirstName(e.target.value)}
          className="Sign-up-input"
          defaultValue={firstName}
        ></input>
        <p>Last name</p>
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
            <Link to={`/user/account/${localUser._id}`}>
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