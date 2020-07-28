import React, { useState, useEffect } from "react";
import {
  Button,
  InputLabel,
  FormControl,
  FormHelperText,
  Input,
  Container,
} from "@material-ui/core";
import "./style.css";
import Message from "./Message";
import db from "./firebase";
import firebase from "firebase";
import FlipMove from "react-flip-move";
import SendIcon from "@material-ui/icons/Send";
import { IconButton } from "@material-ui/core";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Run once the app component loads
    db.collection("message")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, message: doc.data() }))
        );
      });
  }, []);

  useEffect(() => {
    setUsername(prompt("Type your username"));
  }, []);

  const sendMessages = (e) => {
    e.preventDefault();

    db.collection("message").add({
      message: input,
      username: username,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
  };

  return (
    <Container className="App">
      <img
        src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=100&h=100"
        alt=""
      />
      <h1>Hello world!</h1>
      <h2>Welcome {username} </h2>
      <form className="app_form" onSubmit={sendMessages}>
        <FormControl className="app_formControl">
          <Input
            placeholder="Enter a message..."
            value={input}
            variant="contained"
            className="app__input"
            color="white"
            onChange={(e) => setInput(e.target.value)}
            type="text"
          />
          <IconButton
            disabled={!input}
            type="submit"
            className="app__iconButton"
          >
            <SendIcon />
          </IconButton>
        </FormControl>
      </form>

      <FlipMove>
        {messages.map(({ message, id }) => (
          <Message key={id} username={username} message={message} />
        ))}
      </FlipMove>
    </Container>
  );
}

export default App;
