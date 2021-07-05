import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

export default function CreateAccount () {
  
  const api = "http://localhost:5000/user/create-account";

  const history = useHistory();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("Male");
  const [sexualPreference, setSexualPreference] = useState("Straight");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [errors, setErrors ] = useState([]);

  const submit = () => {

    const data = new FormData();
    data.append("firstName", firstName)
    data.append("lastName", lastName)
    data.append("emailAddress", emailAddress)
    data.append("password", password)
    data.append("gender", gender)
    data.append("sexualPreference", sexualPreference)
    data.append("age", age)   
    data.append("description", description)
    data.append("file", file)   

    axios
    ({
      method: 'post',
      url: api,
      data: data,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => {
        history.push({
          pathname: "/",
        });
      })
      .catch((error) => setErrors(error.response.data.errors));
      console.log(errors)
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth"});

  const handleSubmit = (event) => {
    event.preventDefault();
    if (errors) {
      scrollToTop()
    }
    submit()
  }

  return (
    <div>
      <div>
        <h1>Create account</h1>
      </div>
      {errors.map((error, i) => <li className="Errors" key={i}>{error}</li>)}
      <form onSubmit={handleSubmit} encType="multipart/form-data" >
        <input
          id="firstName"
          name="firstName"
          type="firstName"
          placeholder="First Name"
          className="Sign-up-input"
          onChange={(e) => setFirstName(e.target.value)}
          style={{ border: setFirstName === "" ? '100px solid red' : '' }}
        ></input>
        <input
          id="lastName"
          name="lastName"
          type="lastName"
          placeholder="Last Name"
          className="Sign-up-input"
          onChange={(e) => setLastName(e.target.value)}
        ></input>
        <input
          id="emailAddress"
          name="emailAddress"
          type="emailAddress"
          placeholder="Emailaddress"
          className="Sign-up-input"
          onChange={(e) => setEmailAddress(e.target.value)}
        ></input>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className="Sign-up-input"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <p>Gender</p>
        <select
          id="gender"
          name="gender"
          type="gender"
          className="Sign-up-select"
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <p>Sexual Preference</p>
        <select
          id="sexualPreference"
          name="sexualPreference"
          type="sexualPreference"
          className="Sign-up-select"
          onChange={(e) => setSexualPreference(e.target.value)}
        >
          <option value="Straight" >Straight</option>
          <option value="Gay" >Gay</option>
          <option value="Lesbian" >Lesbian</option>
          <option value="Bisexual" >Bisexual</option>
        </select>
        <input
          id="age"
          name="age"
          type="age"
          placeholder="age"
          className="Sign-up-input"
          onChange={(e) => setAge(e.target.value)}
        ></input>
        <textarea
          id="description"
          name="description"
          type="description"
          placeholder="Description"
          className="Sign-up-text"
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="Upload">
             <input 
                    type="file" 
                    name="file" 
                    id="file"
                    onChange={event => {
                        const file = event.target.files[0]
                        setFile(file)
                      }}
                    >
            </input>
        </div>    
        <div>
        <button type="submit" className="Login-button" onClick={handleSubmit}>Submit</button>
        </div>
      </form>
    </div>
  );
};
