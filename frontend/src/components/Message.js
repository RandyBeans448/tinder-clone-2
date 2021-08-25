import React from 'react';
import { format } from "timeago.js";

export default function Message(message) {

    console.log(message)

    return (
        <div>
             <p >{message.message}</p>
             <div >{format(message.createdAt)}</div>
        </div>
    )
}
