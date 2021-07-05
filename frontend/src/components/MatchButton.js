import React from "react";
import { Link, useParams } from "react-router-dom";

export default function MatchButton({ person }) {

  const { id } = useParams();
  console.log(id);

    return (

        <div className="Message-div">
            <Link to={`/user/chatroom/${id}/${person._id}`}>
            <button className="Message-button" style={{backgroundImage: `url(http://localhost:5000/${person.path})`, backgroundSize: 'cover'}}/>
            </Link>
            <p className="Message-name">{person.firstName}</p>
        </div>
    )
}
