import React, { useState } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import * as Queries from "./graphql/queries";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

// component
const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);

  useQuery(Queries.messagesQuery, {
    onCompleted: ({ messages }) => setMessages(messages),
  });

  useSubscription(Queries.messageAddedSubscription, {
    onSubscriptionData: ({
      subscriptionData: {
        data: { messageAdded },
      },
    }) => {
      setMessages(messages.concat(messageAdded));
    },
  });

  const [addMessage] = useMutation(Queries.addMessageMutation);

  const handleSend = async (text) => {
    await addMessage({ variables: { input: { text } } });
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Chatting as {user}</h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  );
};

export default Chat;
