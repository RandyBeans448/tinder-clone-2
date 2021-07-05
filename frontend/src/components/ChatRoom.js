import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import Header from "./Header";

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from "@material-ui/core/IconButton";
import SendIcon from '@material-ui/icons/Send';

import socketIOClient from "socket.io-client";
import axios from "axios";

import { UserContext } from "../Context/UserContext";

export default function ChatRoom() {

    const [ match, setMatch ] = useState({})
    const { userState, setUserState } = useContext(UserContext);
    const { userid } = useParams();

    const history = useHistory();

    const { id } = useParams();
    console.log(userid)
    console.log(id);

    const api = `http://localhost:5000/user/chatroom/${id}/${userid}`;

    useEffect(() => {
        const data = localStorage.getItem("user");
        console.log(JSON.parse(data))
        setUserState(JSON.parse(data))
        userState.matches.map(person => {
            if (person._id === userid) {
                setMatch(person)
                return person
            }
        })
    }, []);

    const unmatch = (event) => {
        event.preventDefault();
        axios
          .patch(api, { removeMatch: match }, {
            headers: {
              Authorization: localStorage.getItem("jwt"),
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
          })
          .then((res) => {
            history.push({ pathname: `/user/account/${id}` });
            console.log(res.data);
           
          })
          .catch((errors) => {
            console.log("Course not deleted", errors);
          });
      };


    return (
        <div>
            <div>
                <Header/>
                <div className="Chat-banner">
                <div className="Chat-container">
                <div className="Chat-img" style={{backgroundImage: `url(http://localhost:5000/${match.path})`, backgroundSize: 'cover'}}/>
                <button onClick={unmatch} className="Chat-unmatch-button"><IconButton><HighlightOffIcon></HighlightOffIcon></IconButton></button>
                </div>
                </div>
                <div className="Chat-box-wrapper">
                <div className="Chat-box">
                </div>
                </div>
                <div className="Chat-area-wrapper">
                <textarea className="Chat-area"></textarea>
                <button className="Chat-send"><IconButton><SendIcon></SendIcon></IconButton></button>
                </div>
            </div>
        </div>
    )
}
