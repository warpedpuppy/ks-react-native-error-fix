import React from 'react';
import { StyleSheet, Yellowbox} from 'react-native';
import 'react-native-gesture-handler';

// navigation
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Chat from './components/Chat';
import Start from './components/Start';

const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  // patch for ignoring yellowbox warning during development, can't use useEffect hook as suggested in React 16.13.1 docs
  componentDidMount() {
    console.disableYellowBox = true;
    }

  render() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start'>

        <Stack.Screen
        name='Start'
        component={Start}
        />

        <Stack.Screen
        name='Chat'
        component={Chat}
        />

      </Stack.Navigator>
    </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },


});
