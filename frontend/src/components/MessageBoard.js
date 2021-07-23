import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./Header";
import MatchButton from './MatchButton'
import axios from "axios";
import { UserContext } from "../Context/UserContext";

export default function MessageBoard () {

  const { id } = useParams();

  const api = `http://localhost:5000/user/account/${id}`;

  const [ matches, setMatches ] = useState({});
  const [ conversations, setConversations ] = useState([])

  const { userState, setUserState } = useContext(UserContext);

  const data = localStorage.getItem("user");
  console.log(JSON.parse(data) ,"data")

  useEffect(() => {
    axios
      .get(api, {
        headers: {
          Authorization: localStorage.getItem("jwt"),
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      })
      .then((res) => {
        console.log(res.data.conversation, 'conversation')
        setConversations(res.data.conversation)
        setMatches(res.data.user.matches);
      });
  }, []);


  const matchesState = Array.from(matches);
  console.log(matchesState, "Matches state")
  console.log(conversations)

    return (
      <div>
        <Header />
        <div className="Message-board-container" >
          {matchesState.length === 0 ? (
            <div>
              <div className="No-matches-container">
                <div className="No-matches-div">
                <img 
                     width="250px"
                     height="300px" 
                     src="/noMatches.jpeg" />
                     <p>Find your matches here!</p>
                     <button className="No-matches-button"><Link to={`/user/match/${id}`}>Get swiping!</Link></button>
                </div>     
              </div>
            </div>
          ) : (
            matchesState.map((person, index) => {
              return <div className="Message-item" key={index}><MatchButton conversations={conversations} person={person}/></div>
            })
          )}
        </div>
      </div>
    );
  };
  
