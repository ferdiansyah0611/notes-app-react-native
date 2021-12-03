import React from 'react'
import {
  View, HStack, Box, Heading, Text, Pressable, Flex, Icon, Menu
} from 'native-base'
import {
  StyleSheet
} from 'react-native'
import { AntDesign, Entypo } from '@expo/vector-icons'
import ctx from '../store'
import {auth} from '../fb'
import {useNavigation} from '@react-navigation/native'

export default function Appbar({tabs, setTabs}){
  const store = React.useContext(ctx)
  const navigation = useNavigation()
  var logout = async() => {
    await auth.signOut()
    navigation.navigate('Login')
  }
  return(
    <>
      <View style={style.container}>
        <Box borderBottomWidth="2" borderColor="#eeeeee">
          <HStack>
            <Box p="3" flex="1">
              <Heading bold>{store.name} Dev by Ferdi</Heading>
            </Box>
            <Box p="4">
              <Menu
                w="200"
                trigger={(triggerProps) => {
                  return(
                    <Pressable {...triggerProps}>
                      <Icon
                        as={Entypo}
                        name="dots-three-horizontal"
                        color="black"
                        size={5}
                      />
                    </Pressable>
                  )
                }}
              >
                <Menu.Item>{store.user && store.user.displayName}</Menu.Item>
                <Menu.Item onPress={logout}>{store.user && 'Logout'}</Menu.Item>
              </Menu>
            </Box>
          </HStack>
          <HStack style={style.tabs}>
            <Pressable flex="1" onPress={() => setTabs('all')}>
              <Box p="4" style={[tabs === 'all' ? style.tabActive : {}, style.pointer]}>
                <Text style={style.tabText}>All</Text>
              </Box>
            </Pressable>
            <Pressable flex="1" onPress={() => setTabs('folder')}>
              <Box p="4" style={[tabs === 'folder' ? style.tabActive : {}, style.pointer]}>
                <Text style={style.tabText}>Folder</Text>
              </Box>
            </Pressable>
          </HStack>
        </Box>
      </View>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  tabs: {
    justifyContent: 'center'
  },
  tabText: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  tabActive: {
    borderBottomColor: 'blue',
    borderBottomWidth: 2,
    color: 'blue'
  },
  pointer: {
    cursor: 'pointer'
  }
})