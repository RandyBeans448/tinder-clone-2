import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AOS from "aos";
import "aos/dist/aos.css"; 

export default function MatchButton({ conversations, person }) {
  const { id } = useParams();
  const [userConvo, setUserConvo] = useState({});

  useEffect(() => {
    AOS.init({
      duration: 1500,
    });
  }, []);

  useEffect(() => {
    for (const convo of conversations) {
      if (convo.members[1] === person._id || convo.members[0] === person._id) {
        setUserConvo(convo);
      }
    }
  }, [conversations, person._id]);

  return (
    <div data-aos="zoom-out" className="Message-div">
      <Link to={`/user/conversation/${id}/${person._id}/${userConvo._id}`}>
        <div className="Message-wrapper">
          <button
            className="Message-button"
            style={{
              backgroundImage: `url(http://localhost:5000/${person.path})`,
              backgroundSize: "cover",
            }}
          />
          <p className="Message-name">{person.firstName}</p>
        </div>
      </Link>
    </div>
  );
}
