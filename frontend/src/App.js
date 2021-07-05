import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Login from './components/Login'
import AccountPage from './components/AccountPage';
import AccountSettings from './components/AccountSettings';
import AccountDelete from './components/AccountDelete';
import SwipePage from './components/SwipePage';
import CreateAccount from './components/CreateAccount';
import MessageBoard from './components/MessageBoard';
import ChatRoom from './components/ChatRoom'

import './App.css';

import { UserContext } from './Context/UserContext';


const App = () => {

  const [ userState, setUserState ] = useState(null);
  
  return (
    <Router>
    <div className="App">
      <Switch>
      <UserContext.Provider value={{userState, setUserState}}>
        <Route exact path='/' component={Login}/>
        <Route path='/user/account/:id' component={AccountPage} />
        <Route path='/user/settings/:id' component={AccountSettings}/>
        <Route path='/user/delete/:id' component={AccountDelete}/>
        <Route path='/user/match/:id' component={SwipePage}/>
        <Route path='/user/create-account' component={CreateAccount}/> 
        <Route path='/user/message-board/:id' component={MessageBoard}/> 
        <Route path='/user/chatroom/:id/:userid' component={ChatRoom}/> 
        </UserContext.Provider>
      </Switch>
    </div>
  </Router>
  )
};

export default App

/*

To do Listen - 

  1. Include a MATCH pop up when you get a match.

  2. When tinder card clicked modal behind is shown not current.

  3. Create the messenger app.

  4. Filter searches better for  sexualties.

  5. Filter out users dpending if they have already been liked or disliked (Do this last).

*/