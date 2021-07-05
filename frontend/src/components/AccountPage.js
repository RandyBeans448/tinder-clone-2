import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SettingsIcon from "@material-ui/icons/Settings";
import IconButton from "@material-ui/core/IconButton";

import { UserContext } from "../Context/UserContext";

export default function AccountPage() {

    // Declare a new state variable, which we'll call "count"
    const { id } = useParams();

    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ emailAddress, setEmailAddress ] = useState("");
    const [ gender, setGender ] = useState("");
    const [ sexualPreference, setSexualPreference ] = useState("");
    const [ age, setAge ] = useState("");
    const [ description, setDescription ] = useState("");
    const [file, setFiles] = useState("");

    const { userState, setUserState } = useContext(UserContext);
   
    useEffect(() => {
      axios.get(`http://localhost:5000/user/account/${id}`, {
        headers: {
          Authorization: localStorage.getItem("jwt"),
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      })
      .then((res) => {
        setUserState(res.data.user)
        setFirstName(res.data.user.firstName)
        setLastName(res.data.user.lastName)
        setEmailAddress(res.data.user.emailAddress)
        setGender(res.data.user.gender)
        setSexualPreference(res.data.user.sexualPreference)
        setAge(res.data.user.age)
        setDescription(res.data.user.description)
        setFiles(res.data.user.path)
        console.log(res.data.user)
      });
    }, []);

    return (
      <div>
        <Header />
        <div className="Account-page-wrapper">
        <div alt="profile-pciture" className="Account-page-img"  style={{backgroundImage: `url(http://localhost:5000/${file})`, backgroundSize: 'cover'}} />
        <p>{firstName} {lastName}</p>
        <p>{emailAddress}</p>
        <p>{gender}</p>
        <p>{sexualPreference}</p>
        <p>{age}</p>
        <div className="Account-page-container">
          <p className="Account-page-desc">{description}</p>
        </div>
      </div>
      <div className="Account-page-buttons">
      <Link to={`/user/settings/${id}`}><IconButton><SettingsIcon className="Header-icon" fontSize="large"/></IconButton></Link>
      <Link to={`/user/delete/${id}`}><IconButton><DeleteForeverIcon className="Header-icon" fontSize="large"></DeleteForeverIcon></IconButton></Link>
      </div>
      </div>
    );
  }