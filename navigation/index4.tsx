import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { withAuthenticator } from 'aws-amplify-react-native';
import { getUserData } from '../components/UserData';
import SendNewMessage from '../components/SendNewMessage/SendNewMessage'; // Import the SendNewMessage component

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation, user }) => {
  return (
    <View>
      <Text>Welcome, {user ? user.username : 'Guest'}!</Text>
      {/* Your HomeScreen JSX here */}
    </View>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserData();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ headerTitle: 'Home' }}>
          {(props) => <HomeScreen {...props} user={user} />}
        </Stack.Screen>
        {/* Add a new tab for sending a new message */}
        <Stack.Screen name="SendNewMessage" component={SendNewMessage} options={{ title: 'Send Message' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default withAuthenticator(App);


