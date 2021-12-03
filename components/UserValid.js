import React from 'react'
import {useNavigation} from '@react-navigation/native'
import {auth} from '../fb'

export default function UserValid(){
  const navigation = useNavigation()
  React.useEffect(() => {
    auth.onAuthStateChanged((current) => {
      if(!current){
        navigation.navigate('Login')
      }
    })
  }, [])
  return(
    <></>
  )
}