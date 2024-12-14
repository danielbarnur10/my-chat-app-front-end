import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // Replace with your backend URL

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userId] = useState("user1-uuid"); // Simulate the current user ID
  const [receiverId] = useState("user2-uuid"); // Simulate the receiver ID

  useEffect(() => {
    // Handle incoming messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up the event listener on unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { content: message, senderId: userId, receiverId };
      socket.emit("sendMessage", newMessage); // Emit message to server
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Update local messages
      setMessage(""); // Clear the input
    }
  };

  return (
    <div>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "scroll" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: "5px 0" }}>
            <strong>{msg.senderId === userId ? "You" : "Them"}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage} style={{ width: "20%" }}>
        Send
      </button>
    </div>
  );
};

export default Chat;