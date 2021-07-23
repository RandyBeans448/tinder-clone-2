import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function MatchButton({ conversations, person }) {

  const { id } = useParams();

  console.log(person._id, person.firstName)
  console.log(id);
  
  const [ userConvo, setUserConvo ] = useState({});

  useEffect(() => {
    for (const convo of conversations) {
        if (convo.members[1] === person._id || convo.members[0] === person._id) {
          setUserConvo(convo)
        }
      };
  }, []);

    return (
  <div className="Message-div" >
            <Link to={`/user/conversation/${id}/${person._id}/${userConvo._id}`}>
            <button className="Message-button" style={{backgroundImage: `url(http://localhost:5000/${person.path})`, backgroundSize: 'cover'}}/>
            </Link>
            <p className="Message-name">{person.firstName}</p>
     </div>
    )
};
