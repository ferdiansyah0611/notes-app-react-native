import React, { useState, useContext } from 'react'
import {
  View, Input, VStack, Button, Box, Card, Heading, Text, Pressable
} from 'native-base'
import {
  StyleSheet
} from 'react-native'
import {auth} from '../fb'
import ctx from '../store'

export default function Login({navigation}){
  const store = useContext(ctx)
  const [state, dispatch] = useState({
    email: '', password: ''
  })
  const handle = (type, value) => {
    dispatch({...state, [type]: value})
  }
  const submit = () => {
    auth.signInWithEmailAndPassword(state.email, state.password).then((userCredential) => {
      var user = userCredential.user;
      store.set({
        user: user
      })
      alert(user.displayName)
      navigation.navigate('Home')
    })
  }
  return(
    <View style={style.container}>
      <Box p="2">
        <VStack bg="white" borderRadius="10">
          <Box p="2">
            <Heading style={style.center} size="lg">Sign In Notes</Heading>
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
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text>Don't have a account ? Register</Text>
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