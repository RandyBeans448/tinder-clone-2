import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import SettingsIcon from "@material-ui/icons/Settings";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";

import { UserContext } from "../Context/UserContext";

export default function AccountPage() {
  // Declare a new state variable, which we'll call "count"
  const { id } = useParams();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [gender, setGender] = useState("");
  const [sexualPreference, setSexualPreference] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFiles] = useState("");

  const { userState, setUserState } = useContext(UserContext);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/user/account/${id}`, {
        headers: {
          Authorization: localStorage.getItem("jwt"),
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      })
      .then((res) => {
        setUserState(res.data.user);
        setFirstName(res.data.user.firstName);
        setLastName(res.data.user.lastName);
        setEmailAddress(res.data.user.emailAddress);
        setGender(res.data.user.gender);
        setSexualPreference(res.data.user.sexualPreference);
        setAge(res.data.user.age);
        setDescription(res.data.user.description);
        setFiles(res.data.user.path);
        console.log(res.data.user);
      });
  }, []);

  return (
    <div>
      <Header />
      <div className="Account-page-container">
        <Card className="Account-page-wrapper">
          <CardActionArea>
            <CardMedia
              className="Account-page-img"
              component="img"
              alt="Contemplative Reptile"
              height="20"
              width="20"
              image={`http://localhost:5000/${file}`}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h1">
                {firstName} {lastName}
              </Typography>
              <div className="Account-address-wrapper">
                <Typography gutterBottom variant="body2" component="p">
                  Email Address
                </Typography>
                <Typography style={{ color: 'red' }} gutterBottom variant="body2" component="p">
                  {emailAddress}
                </Typography>
              </div>
              <div className="Account-address-wrapper">
                <Typography gutterBottom variant="body2" component="p">
                  Gender
                </Typography>
                <Typography style={{ color: 'red' }} gutterBottom variant="body2" component="p">
                  {gender}
                </Typography>
              </div>
              <div className="Account-address-wrapper">
                <Typography gutterBottom variant="body2" component="p">
                  Preference
                </Typography>
                <Typography style={{ color: 'red' }} gutterBottom variant="body2" component="p">
                  {sexualPreference}
                </Typography>
              </div>
              <div className="Account-address-wrapper">
                <Typography gutterBottom variant="body2" component="p">
                  Age
                </Typography>
                <Typography style={{ color: 'red' }} gutterBottom variant="body2" component="p">
                  {age}
                </Typography>
              </div>
              <Typography
                className="Account-page-desc"
                variant="body2"
                color="textSecondary"
                component="p"
              >
                {description}
              </Typography>
              <div className="Account-page-buttons">
            <Link to={`/user/settings/${id}`}>
              <IconButton>
                <SettingsIcon style={{ color: 'white' }} className="Account-buttons" />
              </IconButton>
            </Link>
            <Link to={`/user/delete/${id}`}>
              <IconButton>
                <DeleteForeverIcon style={{ color: 'white' }} className="Account-buttons"></DeleteForeverIcon>
              </IconButton>
            </Link>
          </div>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    </div>
  );
}