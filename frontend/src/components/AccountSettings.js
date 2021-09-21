import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import AOS from "aos";
import "aos/dist/aos.css"; 

import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import CardContent from "@material-ui/core/CardContent";
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

  useEffect(() => {
    AOS.init({
      duration: 1500,
    });
  }, []);

  const submit = () => {
    const data = {
      firstName: firstName,
      lastName: lastName,
      description: description,
    };

    axios
      .patch(`http://localhost:5000/user/settings/${localUser._id}`, data, {
        headers: {
          Authorization: localStorage.getItem("jwt"),
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      })
      .then((res) => {
        console.log(res.data);
        history.push({
          pathname: `/user/account/${localUser._id}`,
        });
      })
      .catch((error) => setErrors(error.response.data.error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

  return (
    <div>
      <Header />
      <p className="Errors">{errors}</p>
      <div data-aos="zoom-out" className="Account-page-container">
      <form onSubmit={handleSubmit}>
        <Card className="Settings-page-wrapper">
          <div className="Settings-div">
          <Typography gutterBottom variant="h5" component="h1" className="Settings-title">
            Settings
          </Typography>
          <CardContent>
            <div className="Settings-container">
              <TextField
                id="standard-read-only-input"
                label="First name"
                onChange={(e) => setFirstName(e.target.value)}
                defaultValue={firstName}
                className="Settings-input"
              />
            </div>
            <div className="Settings-container">
              <TextField
                id="standard-read-only-input"
                label="Last name"
                onChange={(e) => setLastName(e.target.value)}
                defaultValue={lastName}
                className="Settings-input"
              />
            </div>
            <div className="Settings-container-desc">
            <TextField
          label="Description"
          multiline
          rows={6}
          onChange={(e) => setDescription(e.target.value)}
          defaultValue={description}
          className="Settings-textarea"
        />
        </div>
        <div className="Settings-sub-box">
          <div className="Settings-left-button">
            <p className="Settings-p">Submit</p>
       
              <IconButton>
                <CheckCircleIcon style={{ color: 'white' }} className="Settings-button"></CheckCircleIcon>
              </IconButton>
     
          </div>
          <div className="Settings-right-button">
            <p className="Settings-p">Cancel</p>
            <Link to={`/user/account/${localUser._id}`}>
              <IconButton >
                <HighlightOffIcon style={{ color: 'white' }} className="Settings-button"></HighlightOffIcon>
              </IconButton>
            </Link>
          </div>
          </div>
          </CardContent>
          </div>
        </Card>
        </form>
        <div className="Errors-container">
          <p className="Errors-p">{errors}</p>
        </div>
      </div>
    </div>
  );
}