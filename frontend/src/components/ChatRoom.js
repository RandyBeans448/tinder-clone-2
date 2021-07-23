import React, { useContext, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { format } from "timeago.js";

import Header from "./Header";

import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";

import { io } from "socket.io-client";
import axios from "axios";

import { UserContext } from "../Context/UserContext";

export default function ChatRoom() {

  const [match, setMatch] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState({});

  const { userState, setUserState } = useContext(UserContext);

  const { receiverId } = useParams()

  const socket = useRef();
  const scrollRef = useRef();

  const history = useHistory();

  const { conversationId } = useParams();
  const { id } = useParams();

  const api = `http://localhost:5000/user/messenger/${userState._id}/${receiverId}/${conversationId}`;

  useEffect(() => {
    socket.current = io("ws://localhost:7000");
    console.log("start of arrival");
    socket.current.on("getMessage", data => {
      console.log(data, "data");
      console.log(data.senderId, data.message)
      const arrMess = {
        sender: data.senderId,
        message: data.message,
        createdAt: Date.now(),
      };
      console.log(arrMess, "arrMess")
      setArrivalMessage(arrMess);
      console.log(arrivalMessage, "arr message");
      setMessages((prev) => [...prev, arrivalMessage]);
      console.log(messages, "messages with arr");
      getMessages();
    });
  },[]);

  useEffect(()=> {

    socket.current.emit("addUser", userState._id);
    socket.current.on("getUsers", users => {
      console.log(users, "users");
    });

    socket.current.on("disconnect", () => {
      console.log("a user has disconnected");
    })

  }, [id])

  const getMessages = async () => {
    axios
      .get(api, {
        headers: {
          Authorization: localStorage.getItem("jwt"),
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      })
      .then((res) => {
        setMessages(res.data);
      });
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submit = async () => {
    axios
      .post(
        api,
        {
          conversationId: conversationId,
          sender: userState._id,
          message: newMessage,
        },
        {
          headers: {
            Authorization: localStorage.getItem("jwt"),
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        }
      )
      .then((res) => {
        getMessages();
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();

    socket.current.emit("sendMessage", {
      senderId: userState._id,
      receiverId: receiverId,
      message: newMessage
    });
    getMessages();
  };

  const unmatch = (event) => {
    event.preventDefault();
    axios
      .patch(
        api,
        { removeMatch: match },
        {
          headers: {
            Authorization: localStorage.getItem("jwt"),
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        }
      )
      .then((res) => {
        history.push({ pathname: `/user/account/${userState._id}` });
        console.log(res.data);
      })
      .catch((errors) => {
        console.log("Course not deleted", errors);
      });
  };

  return (
    <div>
      <div>
        <Header />
        <div className="Chat-banner">
          <div className="Chat-container">
            {/* <img
          className="Account-page-img"
          src={`http://localhost:5000/${match.path}`}
          alt=""
        /> */}
            <button onClick={unmatch} className="Chat-unmatch-button">
              <IconButton>
                <HighlightOffIcon></HighlightOffIcon>
              </IconButton>
            </button>
          </div>
        </div>
        <div className="Chat-box-wrapper">
          <div className="Chat-box">
            <div className="Chat-messages-wrapper">
            {!messages ? (
              <p> Start chatting </p>
            ) : (
              messages.map((message, index) => {
                return (
                  <div key={index} ref={scrollRef}>
                  <div className="Dialog-box-container">
                    <p className="Dialog-box-message">{message.message}</p>
                  </div>
                   <p className="Dialog-box-date">{format(message.createdAt)}</p>
                   </div>
                );
              })
            )}
            </div>
          </div>
        </div>
        <div className="Chat-area-wrapper">
          <textarea
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
            className="Chat-area"
          ></textarea>
          <button onClick={handleSubmit} className="Chat-send">
            <IconButton>
              <SendIcon></SendIcon>
            </IconButton>
          </button>
        </div>
      </div>
    </div>
  );
}