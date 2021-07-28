import React from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import axios from "axios";

export default function AccountDelete() {
  // Declare a new state variable, which we'll call "count"

  const history = useHistory();

  const { id } = useParams();

  const api = `http://localhost:5000/user/delete/${id}`;

  const deleteAccount = (event) => {
    event.preventDefault();
    axios
      .delete(api, {
        headers: {
          Authorization: localStorage.getItem("jwt"),
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      })
      .then((res) => {
        console.log(res.data);
        history.push({
          pathname: "/",
        });
      })
      .catch((errors) => {
        console.log("Course not deleted", errors);
      });
  };

  return (
    <div>
      <div>
        <h1>Account deletion</h1>
      </div>
      <div>
        <p>Are you sure you want to delete your account?</p>
      </div>
      <div>
        <button onClick={deleteAccount}> Delete </button>
      </div>
      <Link to={`/user/settings/${id}`}> Back to Settings </Link>
    </div>
  );
}