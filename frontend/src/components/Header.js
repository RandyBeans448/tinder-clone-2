
import React from "react";
import { Link, useParams } from "react-router-dom";

import MessageIcon from '@material-ui/icons/Message';
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';

export default function Header() {

    const { id } = useParams();

    return ( 
    <div className="Header"> 
    <Link to={`/user/account/${id}`}><IconButton><PersonIcon style={{ color: 'red' }} className="Header-icon" /></IconButton></Link>
    <Link to={`/user/match/${id}`}><IconButton><img className="Header-logo" alt="Tinder" src="https://www.logo.wine/a/logo/Tinder_(app)/Tinder_(app)-Flame-Logo.wine.svg" height="100px"></img></IconButton></Link>
    <Link to={`/user/message-board/${id}`}><IconButton><MessageIcon style={{ color: 'red' }} className="Header-icon"/></IconButton></Link>
    </div> 
    );
}

