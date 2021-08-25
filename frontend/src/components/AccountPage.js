import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

import AOS from "aos";
import "aos/dist/aos.css"; 

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import SettingsIcon from "@material-ui/icons/Settings";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

export default function AccountPage() {
  // Declare a new state variable, which we'll call "count"
  const { id } = useParams();

  const local = localStorage.getItem("user");
  const localUser = JSON.parse(local);

  useEffect(() => {
    AOS.init({
      duration: 1500,
    });
  }, []);

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
        localStorage.setItem("user", JSON.stringify(res.data.user));
      });
  }, []);

  return (
    <div>
      <Header  />
      <div data-aos="zoom-out" className="Account-page-container">
        <Card className="Account-page-wrapper">
            <CardMedia
              className="Account-page-img"
              component="img"
              height="20"
              width="20"
              image={`http://localhost:5000/${localUser.path}`}
            />
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
            <CardContent>
              <Typography gutterBottom variant="h5" component="h1">
                {localUser.firstName} {localUser.lastName}
              </Typography>
              <div className="Account-address-wrapper">
                <Typography gutterBottom variant="body2" component="p">
                  Email Address
                </Typography>
                <Typography style={{ color: 'red' }} gutterBottom variant="body2" component="p">
                  {localUser.emailAddress}
                </Typography>
              </div>
              <div className="Account-address-wrapper">
                <Typography gutterBottom variant="body2" component="p">
                  Gender
                </Typography>
                <Typography style={{ color: 'red' }} gutterBottom variant="body2" component="p">
                  {localUser.gender}
                </Typography>
              </div>
              <div className="Account-address-wrapper">
                <Typography gutterBottom variant="body2" component="p">
                  Preference
                </Typography>
                <Typography style={{ color: 'red' }} gutterBottom variant="body2" component="p">
                  {localUser.sexualPreference}
                </Typography>
              </div>
              <div className="Account-address-wrapper">
                <Typography gutterBottom variant="body2" component="p">
                  Age
                </Typography>
                <Typography style={{ color: 'red' }} gutterBottom variant="body2" component="p">
                  {localUser.age}
                </Typography>
              </div>
              <Typography className="Account-page-desc" variant="body2" color="textSecondary" component="p">
                {localUser.description}
              </Typography>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}