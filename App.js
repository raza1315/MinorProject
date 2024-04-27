import { StyleSheet, Text, View,StatusBar } from 'react-native';
import StackNavigator from './StackNavigator';
import { UserContext } from './UserContext';

export default function App() {
  return (
    <>
        <StatusBar
          backgroundColor="transparent"
          translucent={true}
          barStyle="light-content"
        />
      <UserContext>
        <StackNavigator />
      </UserContext>
    </>
  );
}

