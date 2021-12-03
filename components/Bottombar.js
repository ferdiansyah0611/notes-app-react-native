import React from 'react'
import {
  View, Flex, Pressable, Box, Text, Icon, HStack, Center, VStack
} from 'native-base'
import {
  StyleSheet
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons'

export default function Bottombar(){
  const navigation = useNavigation()
  return(
    <View style={style.container}>
      <HStack justifyContent="center">
        <Pressable flex="1">
          <Box p="3">
            <Center>
              <Icon
                as={Ionicons}
                name="alarm-outline"
                size={6}
              />
              <Text>New Reminder</Text>
            </Center>
          </Box>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Create')} flex="1">
          <Box p="3">
            <Center>
              <Icon
                as={SimpleLineIcons}
                name="note"
                size={6}
              />
              <Text>New Note</Text>
            </Center>
          </Box>
        </Pressable>
      </HStack>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopColor: '#eeeeee',
    borderTopWidth: 1,
  }
})