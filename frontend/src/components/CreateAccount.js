import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import "aos/dist/aos.css"; 

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

export default function CreateAccount() {
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
  const [file, setFile] = useState(undefined);
  const [errors, setErrors] = useState([]);
  const [fileErrorState, setFileError] = useState()

  const genderOptions = [
    {
      value: "Male",
      label: "♂",
    },
    {
      value: "Female",
      label: "♀",
    },
  ];

  const prefOptions = [
    {
      value: "Straight",
      label: "⚤",
    },
    {
      value: "Gay",
      label: "⚣",
    },
    {
      value: "Bisexual",
      label: "⚥",
    },
  ];

  const submit = () => {
    console.log(file, "oioi")


    
    const data = new FormData();
    data.append("firstName", firstName);
    data.append("lastName", lastName);
    data.append("emailAddress", emailAddress);
    data.append("password", password);
    data.append("gender", gender);
    data.append("sexualPreference", sexualPreference);
    data.append("age", age);
    data.append("description", description);
    data.append("file", file);

    axios({
      method: "post",
      url: api,
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        history.push({
          pathname: "/",
        });
      })
      .catch((error) => setErrors(error.response.data.error));
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (errors) {
      scrollToTop();
    }
    if (file === undefined) {
      let fileError = "please upload a picture"
      setFileError(fileError);
    }
    submit();
  };

  return (
    <div>
    <div>
      <div data-aos="zoom-out" className="Sign-up-div">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h4" component="h1">
                Create account
              </Typography>
              <div className="Errors-container">
                <p className="Errors-p">{fileErrorState}</p>
         {errors.map(( error, index ) => { return <p key={index} className="Errors-p">{error}</p>})}
         </div>
              <div className="Sign-up-input-div">
                <TextField
                  id="firstName"
                  name="firstName"
                  type="firstName"
                  label="First name"
                  placeholder="First Name"
                  variant="outlined"
                  className="Sign-up-input"
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    border: setFirstName === "" ? "100px solid red" : "",
                  }}
                />
              </div>
              <div className="Sign-up-input-div">
                <TextField
                  id="lastName"
                  name="lastName"
                  type="lastName"
                  label="Last name"
                  placeholder="Last Name"
                  variant="outlined"
                  className="Sign-up-input"
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    border: setFirstName === "" ? "100px solid red" : "",
                  }}
                />
              </div>
              <div className="Sign-up-input-div">
                <TextField
                  id="emailAddress"
                  name="emailAddress"
                  type="emailAddress"
                  label="Email address"
                  placeholder="Emailaddress"
                  variant="outlined"
                  className="Sign-up-input"
                  onChange={(e) => setEmailAddress(e.target.value)}
                  style={{
                    border: setFirstName === "" ? "100px solid red" : "",
                  }}
                />
              </div>
              <div className="Sign-up-input-div">
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Password"
                  variant="outlined"
                  className="Sign-up-input"
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    border: setFirstName === "" ? "100px solid red" : "",
                  }}
                />
              </div>

              <div className="Sign-up-input-div">
                <TextField
                  id="gender"
                  select
                  label="Gender"
                  value={gender}
                  className="Sign-up-input"
                  onChange={(e) => setGender(e.target.value)}
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option.label} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              <div className="Sign-up-input-div">
                <TextField
                  id="sexual preference"
                  select
                  label="Sexual preference"
                  value={sexualPreference}
                  className="Sign-up-input"
                  onChange={(e) => setSexualPreference(e.target.value)}
                >
                  {prefOptions.map((option) => (
                    <MenuItem key={option.label} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
                </div>

                <div className="Sign-up-input-div">
                  <TextField
                    id="age"
                    name="age"
                    type="age"
                    placeholder="age"
                    label="Age"
                    variant="outlined"
                    className="Sign-up-input"
                    onChange={(e) => setAge(e.target.value)}
                    style={{
                      border: setFirstName === "" ? "100px solid red" : "",
                    }}
                  />
                </div>
                
                <div className="Sign-up-input-div">
                  <TextField
                    label="Description"
                    multiline
                    rows={6}
                    variant="outlined"
                    className="Sign-up-input"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="Sign-up-upload-button-div">
                  <Button
                    variant="contained"
                    component="label"
                    className="Sign-up-input-button"
                  >
                    Upload File
                    <input
                      type="file"
                      name="file"
                      id="file"
                      hidden
                      onChange={(event) => {
                        const file = event.target.files[0];
                        setFile(file);
                      }}
                    />
                  </Button>
                </div>
              <div>
                <Button
                  type="submit"
                  variant="outlined"
                  color="secondary"
                  className="Sign-up-input"
                  onClick={handleSubmit}
                >
                  Create account
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
    </div>
  );
}