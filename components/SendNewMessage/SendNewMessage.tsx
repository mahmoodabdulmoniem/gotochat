import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, FlatList } from "react-native";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { createMessage } from "../../src/graphql/mutations";
import { listMessages } from "../../src/graphql/queries";

const SendNewMessage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => setAuthUser(user))
      .catch((error) => console.error("Error fetching authenticated user:", error));

    // Fetch messages when the component mounts
    fetchMessages();
  }, []);

  useEffect(() => {
    // Scroll to the latest message when messages change
    flatListRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await API.graphql({
        query: listMessages,
        variables: { limit: 10 }, // Adjust the limit as needed
      });

      const newMessages = response.data.listMessages.items;
      setMessages(newMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
    }
  };

  const sendMessage = async () => {
    try {
      const newMessage = {
        id: "temp-id", // Generate a temporary ID for the message
        content: message,
        userID: authUser.attributes.sub,
        createdAt: new Date().toISOString(),
      };

      // Display sent message immediately
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Save the message to the backend
      await API.graphql(
        graphqlOperation(createMessage, {
          input: {
            content: message,
            userID: authUser.attributes.sub,
          },
        })
      );

      // Refetch messages after sending a new message
      fetchMessages();
      resetFields();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const resetFields = () => {
    setMessage("");
  };

  const onPress = () => {
    sendMessage();
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.userID === authUser.attributes.sub;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        <Text style={styles.messageContent}>{item.content}</Text>
        <Text style={styles.messageTimestamp}>{formatTimestamp(item.createdAt)}</Text>
      </View>
    );
  };

  const formatTimestamp = (timestamp) => {
    // Implement your timestamp formatting logic here
    // For example: return new Date(timestamp).toLocaleTimeString();
    return timestamp;
  };

  return (
    <View style={styles.root}>
      {/* Display Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
      />

      {/* Input to send a new message */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
        />
      </View>
      <Pressable style={styles.buttonContainer} onPress={onPress}>
        <Text style={styles.buttonText}>Send</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
    maxWidth: "80%",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#3777f0",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#dedede",
  },
  messageContent: {
    color: "white",
  },
  messageTimestamp: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#dedede",
    alignItems: "center",
    flexDirection: "row",
    padding: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonContainer: {
    marginTop: 10,
    backgroundColor: "#3777f0",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default SendNewMessage;
