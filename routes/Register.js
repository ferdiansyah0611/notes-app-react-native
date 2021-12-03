import React, { useState, useContext } from 'react'
import {
  View, Input, VStack, Button, Box, Card, Heading, Text, Pressable
} from 'native-base'
import {
  StyleSheet
} from 'react-native'
import {auth} from '../fb'
import ctx from '../store'

export default function Register({navigation}){
  const store = useContext(ctx)

  const [state, dispatch] = useState({
    email: '', password: '', name: ''
  })
  const handle = (type, value) => {
    dispatch({...state, [type]: value})
  }
  const submit = () => {
    auth.createUserWithEmailAndPassword(state.email, state.password).then(async(userCredential) => {
      var user = userCredential.user;
      await auth.currentUser.updateProfile({
        displayName: state.name
      })
      store.set({user: user})
      navigation.navigate('Home')
    })
  }
  return(
    <View style={style.container}>
      <Box p="2">
        <VStack bg="white" borderRadius="10">
          <Box p="2">
            <Heading style={style.center} size="lg">Sign Up Notes</Heading>
          </Box>
          <Box p="2">
            <Input value={state.name} onChangeText={(t) => handle('name', t)} type="text" placeholder="Name"/>
          </Box>
          <Box p="2">
            <Input value={state.email} onChangeText={(t) => handle('email', t)} type="email" placeholder="Email"/>
          </Box>
          <Box p="2">
            <Input value={state.password} onChangeText={(t) => handle('password', t)} type="password" placeholder="Password"/>
          </Box>
          <Box p="2">
            <Button onPress={submit}>Submit</Button>
          </Box>
          <Box p="2">
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text>Have a account ? Signin</Text>
            </Pressable>
          </Box>
        </VStack>
      </Box>
    </View>
  )
}

var style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center'
  }
})