import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage, fetchMessages } from "../store/messages";

const Message = () => {
  const { messages, auth, users } = useSelector((state) => state);
  const [messageContent, setMessageContent] = useState("");
  const [receiverId, setReceiverId] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  const createMessage = (content, toId) => {
    if (window.socket && window.socket.readyState === WebSocket.OPEN) {
      window.socket.send(
        JSON.stringify({ fromId: auth.userId, toId, content })
      );
      dispatch(sendMessage({ toId, content }));
    }
  };

  const handleInputChange = (event) => {
    setMessageContent(event.target.value);
  };

  const handleSendClick = () => {
    createMessage(messageContent, receiverId);
    setMessageContent("");
  };

  const handleReceiverChange = (event) => {
    setReceiverId(event.target.value);
  };

  return (
    <div>
      <h3>Messages</h3>
      <div>
        {messages
          .filter(
            (message) =>
              (message.fromId === auth.id && message.toId === receiverId) ||
              (message.fromId === receiverId && message.toId === auth.id)
          )
          .map((message) => (
            <div key={message.id}>
              <p>
                From: {users.find((user) => user.id === message.fromId)?.name}{" "}
                To: {users.find((user) => user.id === message.toId)?.name}
              </p>
              <p>Message: {message.content}</p>
              <p>Sent: {new Date(message.createdAt).toLocaleString()}</p>
            </div>
          ))}
        <input value={messageContent} onChange={handleInputChange} />
        <select value={receiverId} onChange={handleReceiverChange}>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <button onClick={handleSendClick}>Send Message</button>
      </div>
    </div>
  );
};

export default Message;
