import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { format } from "timeago.js";

import Message from "./Message";

import Header from "./Header";

import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import IconButton from "@material-ui/core/IconButton";

import { io } from "socket.io-client";
import axios from "axios";

export default function ChatRoom() {
  const local = localStorage.getItem("user");
  const localUser = JSON.parse(local);

  const [match, setMatch] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState({});
  const [errors, setErrors] = useState([]);

  // console.log(newMessage)

  const socket = useRef();
  const scrollRef = useRef();

  const history = useHistory();

  const { receiverId } = useParams();
  const { conversationId } = useParams();

  const api = `http://localhost:5000/user/messenger/${localUser._id}/${receiverId}/${conversationId}`;

  const callBack = useCallback(() => {
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
    getMessages();
  }, [api]);

  useEffect(() => {
    console.log(receiverId);

    setMatch(receiverId);

    console.log(match, "match");

    socket.current = io("ws://localhost:7000");

    socket.current.on("getMessage", (data) => {
      console.log(data);
      const arrMess = {
        sender: data.senderId,
        message: data.message,
        createdAt: Date.now(),
      };

      setArrivalMessage(arrMess);

      console.log(arrivalMessage, "arrivalMessage");

      setMessages((prev) => [...prev, arrivalMessage]);

      console.log(messages, "Messages");

      callBack();
    });
  }, [receiverId, match, arrivalMessage, messages, callBack]);

  useEffect(() => {
    socket.current.emit("addUser", localUser._id);
    socket.current.on("getUsers", (users) => {
      callBack();
    });

    socket.current.on("disconnect", () => {
      console.log("a user has disconnected");
    });
  }, [callBack, localUser._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submit = async () => {
    axios
      .post(
        api,
        {
          conversationId: conversationId,
          sender: localUser._id,
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
        console.log(res.data);
        const arrMessage = res.data.message;
        setArrivalMessage(arrMessage);
        console.log(arrivalMessage, "arrmess");
        callBack();
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
    socket.current.emit("sendMessage", {
      senderId: localUser._id,
      receiverId: receiverId,
      message: newMessage,
    });
    socket.current.on("getMessage", (data) => {
      console.log(data, "data");
    });
  };

  const unmatch = (event) => {
    event.preventDefault();
    console.log("Starting");
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
        history.push({ pathname: `/user/account/${localUser._id}` });
      })
      .catch((errors) => {
        setErrors(errors);
      });
  };

  return (
    <div>
      <div>
        <Header />

        <p> {errors}</p>
        <div >
          <div className="Chat-container"></div>
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
                      <div className={localUser._id === message.sender ? "Message" : "Message-alt"}>
                        <div className={localUser._id === message.sender ? "Message-top" : "Message-top-alt"}>
                          <p className={localUser._id === message.sender ? "Message-text" : "Message-text-alt"}>
                            {message.message}
                          </p>
                        </div>
                        <p className={localUser._id === message.sender ? "Message-bottom" : "Message-bottom-alt"}>
                          {format(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <div className="Chat-area-wrapper">
        <Button
          variant="outlined"
          color="secondary"
          onClick={unmatch}
        >
          Unmatch
        </Button>
          <input
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
            className="Chat-area"
          ></input>
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
