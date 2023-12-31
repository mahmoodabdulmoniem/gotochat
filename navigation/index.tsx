import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Image, Pressable, Text, View, useWindowDimensions, StyleSheet } from 'react-native';
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import LinkingConfiguration from './LinkingConfiguration';
import IndividualChatScreen from '../screens/IndividualChatScreen';
import UsersScreen from '../screens/AllCurrentUsersScreen';
import ChatRoomHeader from './IndividualChatHeader';
import GroupScreen from '../screens/GroupScreen';
import TabOneScreen from '../screens/AllChatsScreen';
import SettingsScreen from "../screens/AllChatsScreenSettings";
import SecondTab from '../screens/SecondTab';
import SendNewMessage from '../components/SendNewMessage/SendNewMessage';
import AllChatsIndividualChat from '../components/AllChatsIndividualChat/AllChatsIndividualChat';
import IndividualMessage from '../components/IndividualMessage/IndividualMessage';
import NewGroupButton from '../components/NewGroupButton/index';
import AddFriendsScreen from "../screens/AddFriendsScreen";
import FriendsListScreen from "../screens/FriendsListScreen";
import Index from '../navigation/index';
import VideoPlayerScreen from '../screens/VideoPlayerScreen'; 



import NotFoundScreen from '../screens/NotFoundScreen';
import ModalScreen from '/screens/ModalScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import Amplify from 'aws-amplify';
import awsconfig from '../src/aws-exports'; // Your AWS configuration file path

// Define HomeScreen component
const HomeScreenComponent = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Pressable onPress={() => navigation.navigate('AllChatsIndividualChat')}>
        <Text>Go to AllChatsIndividualChat Chat</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('AddFriendsScreen')}>
        <Text>Go to AddFriendsScreen Chat</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('VideoPlayerScreen')}>
        <Text>Go to VideoPlayerScreen Chat</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('IndividualMessage')}>
        <Text>Go to IndividualMessage Chat</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('NewGroupButton')}>
        <Text>Go to NewGroupButton Chat</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Index')}>
        <Text>Go to Index Chat</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('SendNewMessage')}>
        <Text>Go to SendNewMessage </Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('GroupScreen')}>
        <Text>Go to Group Chat</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('NotFoundScreen')}>
        <Text>Go to Not Found Screen </Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('ModalScreen')}>
        <Text>Go to ModalScreen </Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('SecondTab')}>
        <Text>Go to SecondTab </Text>
      </Pressable>
    </View>
  );
};
;

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreenComponent} options={{ headerTitle: HomeHeader }} />
      <Stack.Screen name="IndividualChatScreen" component={IndividualChatScreen}
        options={({ route }) => ({ headerTitle: () => <ChatRoomHeader id={route.params?.id || null} />, headerBackTitleVisible: false })} />
      <Stack.Screen name="AddFriendsScreen" component={AddFriendsScreen} options={{ title: "AddFriendsScreen" }} />
      <Stack.Screen name="FriendsListScreen" component={FriendsListScreen} options={{ title: "FriendsListScreen" }} />
      <Stack.Screen name="VideoPlayerScreen" component={VideoPlayerScreen} options={{ title: "VideoPlayerScreen" }} />


      <Stack.Screen name="UsersScreen" component={UsersScreen} options={{ title: "Users" }} />
      <Stack.Screen name="GroupScreen" component={GroupScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="TabOne" component={TabOneScreen} options={{ title: 'Tab One' }} />
      <Stack.Screen name="SecondTab" component={SecondTab} options={{ title: 'Second Tab' }} />
      <Stack.Screen name="NotFoundScreen" component={NotFoundScreen} />
      <Stack.Screen name="ModalScreen" component={ModalScreen} />
      <Stack.Screen name="NewGroupButton" component={NewGroupButton} />
      <Stack.Screen name="SendNewMessage" component={SendNewMessage} />
      <Stack.Screen name="Index" component={Index} />
      <Stack.Screen name="AllChatsIndividualChat" component={AllChatsIndividualChat} />
      <Stack.Screen name="IndividualMessage" component={IndividualMessage} />


      {/* Add other screens here */}
    </Stack.Navigator>
  );
}

const HomeHeader = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const str = 'Goto-chat';
  const highlight = 'Chat';

  let startIndex = str.indexOf(highlight);
  let endIndex = str.indexOf(highlight) + highlight.length;

  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      width,
      padding: 10,
      marginBottom: 7,
      alignItems: "center",
    }}>
     
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          {str.substring(0, startIndex)}
          <Text style={styles.highlight}>
            {str.substring(startIndex, endIndex)}
          </Text>
          {str.substring(endIndex, str.length)}
        </Text>
      </View>
      <Pressable onPress={() => navigation.navigate("Settings")}>
        <Feather
          name="settings"
          size={24}
          color="black"
          style={{ marginLeft: 80 }}
        />
      </Pressable>
      <Pressable onPress={() => navigation.navigate("UsersScreen")}>
        <MaterialIcons
          name="chat"
          size={24}
          color="black"
          style={{ marginHorizontal: 10 }}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  paragraph: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffd633",
    flex: 1,
    textAlign: "center",
    marginLeft: 100,
  },
  highlight: {
    color: "#0099ff",
  },
});

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

