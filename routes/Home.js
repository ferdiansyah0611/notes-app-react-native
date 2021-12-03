import React, { useContext, useMemo, useState } from 'react'
import {
  ScrollView, Text, Input, Box, Icon, Pressable, Flex, Center, VStack, Button, View
} from 'native-base'
import {
  StyleSheet
} from 'react-native'
import { AntDesign, Entypo, MaterialIcons, Feather } from '@expo/vector-icons'
import ctx from '../store'
import { notes } from '../action/firestore'

import Appbar from '../components/Appbar'
import ItemNote from '../components/ItemNote'
import Bottombar from '../components/Bottombar'
import UserValid from '../components/UserValid'

function FolderTab(){
  return(
    <Box p="2">
      <Button>Create Folder</Button>
    </Box>
  )
}

export default function Home({navigation}){
  const store = useContext(ctx)
  const [note, setNote] = useState([])
  const [tabs, setTabs] = useState('all')
  React.useEffect(() => {
    if(store.search){
      var search = store.note.filter(data => data.title.toLowerCase().indexOf(store.search.toLowerCase()) !== -1)
      setNote(search)
    }else{
      setNote(store.note)
    }
  }, [store.search, store.note])
  const deleteNote = React.useCallback(async(key, doc) => {
    store.set({
      note: store.note.filter((data, i) => i !== key),
    })
    await notes.remove(doc)
  }, [store])

  const tabsActive = useMemo(() => tabs, [tabs])
  return(
    <>
      <UserValid/>
      <Appbar tabs={tabs} setTabs={setTabs}/>
      <ScrollView style={style.container}>
      {
        tabsActive === 'all' ?
        <Box p="2">
          <Input value={store.search} onChangeText={(t) => store.set({search: t})} placeholder={"Search for " + store.name} />
          <Flex mt="2" direction="row" justifyContent="center">
            <Pressable onPress={() => navigation.navigate('ShowNote', {onList: true})} flex="1">
              <Box p="2">
                <Center>
                  <Icon
                    as={AntDesign}
                    name="checksquareo"
                    color="primary.500"
                  />
                  <Text align="center">Create List</Text>
                </Center>
              </Box>
            </Pressable>
            <Pressable flex="1">
              <Box p="2">
                <Center>
                  <Icon
                    as={MaterialIcons}
                    name="keyboard-voice"
                    color="secondary.500"
                  />
                  <Text align="center">Voice Memo</Text>
                </Center>
              </Box>
            </Pressable>
            <Pressable flex="1">
              <Box p="2">
                <Center>
                  <Icon
                    as={Feather}
                    name="file-text"
                    color="primary.600"
                  />
                  <Text align="center">Doodle</Text>
                </Center>
              </Box>
            </Pressable>
          </Flex>
          <Box p="2">
            <VStack>
            {
              note.map((data, key) => (
                <ItemNote deleteNote={() => deleteNote(key, data.id)} key={key} keys={key} data={data} />
              ))
            }
            </VStack>
          </Box>
        </Box>
        : <FolderTab/>
      }
      </ScrollView>
      <Bottombar/>
    </>
  )
}

var style = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  }
})