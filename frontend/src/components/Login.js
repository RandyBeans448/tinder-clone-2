import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

import AOS from "aos";
import "aos/dist/aos.css";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";

const api = "http://localhost:5000/login";

export default function Login() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const { userState, setUserState } = useContext(UserContext);

  useEffect(() => {
    AOS.init({
      duration: 1500,
    });
  }, []);

  const submit = () => {
    axios
      .post(
        api,
        { emailAddress: email, password: pass },
        { withCredentials: true, credentials: "include" }
      )
      .then((res) => {
        localStorage.setItem("jwt", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUserState(res.data.user);
        history.push({
          pathname: `/user/account/${res.data.user._id}`,
        });
      })
      .catch((error) => setErrors(error.response.data.error));
    console.log(errors);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

  return (
    <div>
      <div className="Login">
        <div data-aos="zoom-out" className="Login-wrapper">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="h1">
                  Tinder clone
                </Typography>
                <div className="Login-input-div">
                  <TextField
                    id="emailAddress"
                    name="emailAddress"
                    type="text"
                    placeholder="emailAddress"
                    label="Email Address"
                    variant="outlined"
                    className="Login-input-textfield"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="Login-input-div">
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    label="Password"
                    variant="outlined"
                    className="Login-input-textfield"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="Login-button-div">
                  <Button type="submit" variant="outlined" color="secondary">
                    Login
                  </Button>
                </div>
                <Typography gutterBottom variant="p">
                  Don't have a user account{" "}
                  <Link to="/user/create-account"> Click here </Link>
                </Typography>
              </CardContent>
            </Card>
          </form>
        </div>
        <div className="Errors-container">
          <p className="Errors-p">{errors}</p>
        </div>
      </div>
    </div>
  );
}