import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import * as Queries from "./graphql/queries";

export const useChatMessages = () => {
  const { data } = useQuery(Queries.messagesQuery);
  const messages = data ? data.messages : [];

  useSubscription(Queries.messageAddedSubscription, {
    onSubscriptionData: ({
      client,
      subscriptionData: {
        data: { messageAdded },
      },
    }) => {
      client.writeData({
        data: {
          messages: messages.concat(messageAdded),
        },
      });
    },
  });

  const [addMessage] = useMutation(Queries.addMessageMutation);

  return {
    messages,
    addMessage: (text) => addMessage({ variables: { input: { text } } }),
  };
};
