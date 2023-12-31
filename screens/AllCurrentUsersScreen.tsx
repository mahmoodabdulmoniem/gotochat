import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Pressable,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Auth, DataStore } from 'aws-amplify';
import { ChatRoom, User, ChatRoomUser } from '../src/models';
import { useNavigation } from '@react-navigation/native';
import IndividualUser from '../components/IndividualUser';

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const navigation = useNavigation();

  const createChatRoom = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      const dbUser = await DataStore.query(User, authUser.attributes.sub);

      if (!dbUser) {
        showAlert('Error', 'There was an error creating the chat room');
        return;
      }

      const newChatRoomData = {
        newMessages: 0,
        admin: dbUser,
        name: 'New Chat Room',
        imageUri: 'https://example.com/chat-room-image.jpg',
      };

      const newChatRoom = await DataStore.save(new ChatRoom(newChatRoomData));

      await addUserToChatRoom(dbUser, newChatRoom);

      await Promise.all(
        selectedUsers.map((user) => addUserToChatRoom(user, newChatRoom))
      );

      showAlert('Success', 'Chat Room created successfully');
      navigation.navigate('ChatRoom', { id: newChatRoom.id });
    } catch (error) {
      console.error('Error creating chat room:', error);
      showAlert('Error', 'There was an error creating the chat room');
    }
  };

  const addUserToChatRoom = async (user, chatroom) => {
    await DataStore.save(new ChatRoomUser({ user, chatroom }));
  };

  const showAlert = (title, message) => {
    Alert.alert(title, message);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await DataStore.query(User);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const toggleSelectedUser = (item) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.includes(item)
        ? prevUsers.filter((user) => user.id !== item.id)
        : [...prevUsers, item]
    );
  };

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <IndividualUser
            user={item}
            onPress={() => toggleSelectedUser(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => (
          <Pressable
            style={[styles.button, { opacity: selectedUsers.length === 0 ? 0.5 : 1 }]}
            onPress={() => createChatRoom()}
            disabled={selectedUsers.length === 0}
          >
            <Text style={styles.buttonText}>
              Create New Group ({selectedUsers.length} selected)
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 16,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

