import { Auth } from "aws-amplify";
import React from "react";
import { View, Text, Pressable, Alert } from "react-native";

const Settings = () => {
  const logOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'An error occurred while signing out.');
    }
  };

  return (
    <View>
      <Pressable
        onPress={logOut}
        style={{
          backgroundColor: "white",
          height: 50,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>LOGOUT</Text>
      </Pressable>
    </View>
  );
};

export default Settings;

