import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Pressable, Alert, Button } from "react-native";
import { Auth, API, graphqlOperation } from "aws-amplify";

import { listUsers } from "../../src/graphql/queries";

const AddFriendsScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchUsersAndSetResults = async () => {
      try {
        if (searchTerm.trim() !== '') {
          const response = await API.graphql(
            graphqlOperation(listUsers, {
              filter: {
                name: { contains: searchTerm },
              },
            })
          );

          const users = response.data.listUsers.items;
          setSearchResults(users);
          setError(null); // Reset error state
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching for users:', error);
        setError(error); // Set error state for better logging
      }
    };

    searchUsersAndSetResults();
  }, [searchTerm]);

  const handleSendFriendRequest = async (friendUserId) => {
    try {
      // Add logic to send friend request
      // ...
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'An error occurred while sending the friend request.');
    }
  };

  const handleSearchButtonPress = async () => {
    try {
      console.log('Searching for users with term:', searchTerm);

      const response = await API.graphql(
        graphqlOperation(listUsers, {
          filter: {
            name: { contains: searchTerm },
          },
        })
      );

      const users = response.data.listUsers.items;
      setSearchResults(users);
      setError(null);
    } catch (error) {
      console.error('Error searching for users:', error);
      setError(error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Search for friends..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <Button title="Search" onPress={handleSearchButtonPress} />

      {error && (
        <View>
          <Text>Error searching for users:</Text>
          <Text>{JSON.stringify(error, null, 2)}</Text>
        </View>
      )}

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Pressable onPress={() => handleSendFriendRequest(item.id)}>
              <Text>Add as Friend</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

export default AddFriendsScreen;

