import React, { useEffect, useState, useMemo, useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CancelIcon from "@material-ui/icons/Cancel";

import { ClassicSpinner } from "react-spinners-kit";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";

import TinderCard from "react-tinder-card";
import UserModal from "./UserModal";
import MatchModal from "./MatchModal";
import LikedModal from "./LikedModal";
import DislikedModal from "./DislikedModal";

import { UserContext } from "../Context/UserContext";

export default function SwipePage() {
  const [results, setResults] = useState([]);
  // const [isOpen, setIsOpen] = useState(false);
  const [swipeDirection, setDirection] = useState("");
  const [open, setOpen] = useState(false);
  const [ resForMatch, setResForMatch ] = useState(false);

  const { userState, setUserState } = useContext(UserContext);

  console.log(userState)

  const { id } = useParams();

  const api = `http://localhost:5000/user/match/${id}`;

  const alreadyRemoved = [];

  const state = results;

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
        setResults(res.data.users);
      });
  }, []);

  useEffect(() => {
    let timer1 = setTimeout(() => setDirection(""), 1000);
    return () => {
      clearTimeout(timer1);
    };
  });

  useEffect(() => {
    let timer1 = setTimeout(() => setResForMatch(false), 1200);
    return () => {
      clearTimeout(timer1);
    };
  });

  const childRefs = useMemo(
    () => new Array(results.length).fill(0).map((i) => React.createRef()),
    [results]
  );

  const swiped = (direction, person) => {
    alreadyRemoved.push(person);

    setDirection(direction);

    if (direction === "left") {
      axios
        .patch(
          api,
          { dislikes: person },
          {
            headers: {
              Authorization: localStorage.getItem("jwt"),
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
          }
        )
        .then((res) => {
          const data = res.data;
          const resultRemove = results.splice(person);
          setResults(resultRemove);
          setUserState(data);
        })
        .catch((err) => console.log(err, "error"));
    } else if (direction === "right") {
      axios
        .patch(
          api,
          { likes: person },
          {
            headers: {
              Authorization: localStorage.getItem("jwt"),
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
          }
        )
        .then((res) => {
          console.log(res.data, "response data");
          if (res.data.message === 'Its a match') {
            setResForMatch(true);
          }

        })
        .catch((err) => console.log(err));
    };
  };

  const swipe = (dir) => {
    const cardsLeft = results.filter(
      (person) => !alreadyRemoved.includes(person)
    );

    if (cardsLeft.length) {
      alreadyRemoved.push(cardsLeft[cardsLeft.length - 1]);
    }

    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1];

      const index = results.map((person) => person).indexOf(toBeRemoved);

      alreadyRemoved.push(toBeRemoved);

      childRefs[index].current.swipe(dir);

      state.pop();
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Header />
      <div className="Board">
      {resForMatch === true ? <MatchModal/> : <p/> }
        {results.length === 0 ? (
          <div>
            <div className="Loading-container">
              <ClassicSpinner size={60} color="#FF0051" />
            </div>
          </div>
        ) : (
          results.map((person, index) => {
            return (
              <div key={person._id} className="Stack">
                <TinderCard
                  person={person}
                  className="swipe"
                  key={person._id}
                  preventSwipe={["up", "down"]}
                  onSwipe={(direction) => swiped(direction, person)}
                  ref={childRefs[index]}
                >
                  <div key={person._id} className="Card">
                    <img
                      alt={person.firstName}
                      className="Card-img"
                      width="350px"
                      height="500px"
                      src={`http://localhost:5000/${person.path}`}
                    ></img>
                    <h3 className="Card-name-age">
                      {person.firstName}, {person.age}
                    </h3>
                    <div onClick={() => console.log("clicked")}>
                      <button
                        className="Card-button"
                        onClick={handleOpen}
                      ></button>
                      <UserModal
                        key={person._id}
                        handleOpen={handleOpen}
                        handleClose={handleClose}
                        open={open}
                        setOpen={setOpen}
                        person={person}
                        results={results}
                      ></UserModal>
                    </div>
                  </div>
                </TinderCard>
              </div>
            );
          })
        )}
      </div>
      {swipeDirection === "right" ? <LikedModal/> : <p/> }
      {swipeDirection === "left" ?  <DislikedModal/>  : <p/> }
            <IconButton className="Left-button" onClick={() => swipe("left")}>
              <CancelIcon
                style={{ color: red[500] }}
                className="Header-icon"
                fontSize="large"
              />
            </IconButton>
            <IconButton className="Right-button" onClick={() => swipe("right")}> 
              <FavoriteIcon
                style={{ color: green[500] }}
                className="Header-icon"
                fontSize="large"
              />
            </IconButton>
      </div>
  );
}



