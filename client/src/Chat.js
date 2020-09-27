import React, { useReducer, useEffect } from "react";
import { addMessage, getMessages, onMessageAdded } from "./graphql/queries";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const initialState = {
  messages: [],
  subscription: null,
};

const ActionTypes = {
  setMessages: "setMessages",
  setSubscription: "setSubscription",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.setMessages: {
      const { messages } = action.payload;
      return {
        ...state,
        messages: [...state.messages, ...messages],
      };
    }
    case ActionTypes.setSubscription: {
      const { subscription } = action.payload;
      return {
        ...state,
        subscription,
      };
    }
    default:
      return state;
  }
};

// action creators
const setMessages = (messages) => (dispatch) => {
  dispatch({
    type: ActionTypes.setMessages,
    payload: { messages },
  });
};

const setSubscription = (subscription) => (dispatch) => {
  dispatch({ type: ActionTypes.setSubscription, payload: { subscription } });
};

// component
const Chat = ({ user }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const call = (action) => action(dispatch);

  const handleSend = async (text) => {
    await addMessage(text);
  };

  useEffect(() => {
    const { subscription } = state;

    const initialize = async () => {
      const data = await getMessages();
      const subscribe = onMessageAdded((message) => {
        call(setMessages([message]));
      });

      call(setMessages(data));
      call(setSubscription(subscribe));
    };

    initialize();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const { messages } = state;

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
