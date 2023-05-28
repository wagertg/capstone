import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const Message = () => {
  const { messages, auth, user } = useSelector((state) => state);

  return (
    <div>
      <h3>Messages</h3>
      <ul>
        {}
        {messages
          .filter((message) => message.toId === auth.id)
          .map((message) => {
            return <li key={message.id}>{message.content}</li>;
          })}
      </ul>
    </div>
  );
};

export default Message;
