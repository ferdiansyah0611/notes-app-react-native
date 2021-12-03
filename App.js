import React, {Component} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants'
import { NativeBaseProvider, extendTheme } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from './routes/Home'
import CreateScreen from './routes/Create'
import SigninScreen from './routes/Login'
import SignupScreen from './routes/Register'

import ctx from './store'
import {auth} from './fb'
import { notes } from './action/firestore'

const Stack = createNativeStackNavigator()

const customTheme = extendTheme({
  useSystemColorMode: false,
  initialColorMode: 'dark',
})

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      note: [
        // {title: 'Hello World', text: 'Testing', date: Date.now()},
        // {title: 'Hello World 2', text: 'Testing', date: Date.now()},
      ],
      name: 'Notes App',
      search: '',
      user: null,
      set: (data) => this.setState(data)
    }
  }
  componentDidMount(){
    auth.onAuthStateChanged(async(current) => {
      if(current){
        this.setState({
          user: current
        })
        var note = await notes.get(current.uid), i = 1, push = []
        note.forEach(doc => {
          push.push(Object.assign(
            {...doc.data()}, {id: doc.id}
          ))
          if(i === note.docs.length){
            this.setState({note: push})
          }
          i+=1
        })
      }
    })
  }
  render(){
    return (
      <View style={styles.container}>
        <ctx.Provider value={this.state}>
          <NativeBaseProvider theme={customTheme}>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen} options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Create"
                  component={CreateScreen} options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ShowNote"
                  component={CreateScreen} options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Login"
                  component={SigninScreen} options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Register"
                  component={SignupScreen} options={{ headerShown: false }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </NativeBaseProvider>
        </ctx.Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'white',
  }
});
