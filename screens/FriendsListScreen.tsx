import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { Auth, API, graphqlOperation } from "aws-amplify";

const FriendsListScreen = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const response = await API.graphql(
          graphqlOperation(listFriendRequests, {
            filter: {
              fromUserId: { eq: currentUser.attributes.sub },
              status: { eq: "ACCEPTED" },
            },
          })
        );

        const friendRequests = response.data.listFriendRequests.items;
        setFriends(friendRequests);
      } catch (error) {
        console.error("Error fetching friends list:", error);
      }
    };

    fetchFriendsList();
  }, []);

  return (
    <View>
      <Text>Friends List</Text>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.toUser.name}</Text>
            {/* Add any additional friend information you want to display */}
          </View>
        )}
      />
    </View>
  );
};

export default FriendsListScreen;
