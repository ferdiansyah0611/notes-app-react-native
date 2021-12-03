import React, { useReducer, useContext, useEffect, useMemo } from 'react'
import {
  ScrollView, TextArea, View, HStack, Icon, Pressable, Box, Input, Center, useToast, Image, Divider, Button, VStack, Text, Checkbox, Modal, Select, AlertDialog
} from 'native-base'
import {
  StyleSheet
} from 'react-native'
import { Ionicons, Feather, FontAwesome, AntDesign, Entypo, Foundation } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { useFonts } from 'expo-font'

import ctx from '../store'
import { notes } from '../action/firestore'
import UserValid from '../components/UserValid'

function WarnDialog({open, setopen, onQuit, onClose, onSaveQuit}){
  const cancelRef = React.useRef(null)
  return(
    <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={open}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Warning</AlertDialog.Header>
          <AlertDialog.Body>
            Do you want exit without saving a data?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
              >
                Quit
              </Button>
              <Button colorScheme="danger" onPress={onSaveQuit}>
                Save and Quit
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
  )
}
function DialogFont({open, handle, changeFont, font}){
  return(
    <Modal isOpen={open} onClose={handle} size="lg">
      <Modal.Content maxWidth="350">
        <Modal.CloseButton />
        <Modal.Header>Font Family</Modal.Header>
        <Modal.Body>
          <VStack space={3}>
            <Select
              selectedValue={font}
              onValueChange={changeFont}
            >
              <Select.Item label="Choose Font" value="" selected/>
            {
              [ 'Roboto Bold', 'Roboto BoldItalic', 'Roboto Italic', 'Roboto Light', 'Roboto LightItalic', 'Roboto Medium', 'Roboto MediumItalic', 'Roboto Regular', 'Roboto Thin', 'Roboto ThinItalic' ].map((data, i) => (
                <Select.Item label={data} value={data} />
              ))
            }
            </Select>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}
function TopBar({undo, redo, saved, state}){
  const navigation = useNavigation()
  const [open, setopen] = React.useState(false)
  const onQuit = () => {
    if(state.saved === false && (state.title.length >= 1 || state.text.length >= 1 || state.list.length >= 1)){
      setopen(true)
    }else{
      onClose()
    }
  }
  const onClose = () => navigation.navigate('Home')
  const onSaveQuit = async() => {
    await saved()
    onClose()
  }
  return(
    <View style={[style.white, style.containerTop]}>
      <WarnDialog open={open} onSaveQuit={onSaveQuit} setopen={setopen} onClose={onClose} />
      <HStack>
        <Pressable onPress={onQuit} flex="1">
          <Box p="3">
            <Icon as={Ionicons} name="arrow-back"/>
          </Box>
        </Pressable>
        <Pressable onPress={undo}>
          <Box p="3">
            <Icon as={Ionicons} name="arrow-undo-outline"/>
          </Box>
        </Pressable>
        <Pressable onPress={redo}>
          <Box p="3">
            <Icon as={Ionicons} name="arrow-redo-outline"/>
          </Box>
        </Pressable>
        <Pressable onPress={saved}>
          <Box p="3">
            <Icon as={Ionicons} name="checkmark"/>
          </Box>
        </Pressable>
      </HStack>
    </View>
  )
}
function BottomBar({changeImage, handleList, handleFont}){
  const handleChoosePhoto = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      changeImage(result.uri)
    }
  }
  return(
    <View style={style.white}>
      <HStack justifyContent="center">
        <Pressable onPress={handleFont} flex="1">
          <Center>
            <Box p="3">
              <Icon size={6} as={FontAwesome} name="font"/>
            </Box>
          </Center>
        </Pressable>
        <Pressable onPress={handleList} flex="1">
          <Center>
            <Box p="3">
              <Icon size={6} as={AntDesign} name="checkcircleo"/>
            </Box>
          </Center>
        </Pressable>
        <Pressable onPress={handleChoosePhoto} flex="1">
          <Center>
            <Box p="3">
              <Icon size={6} as={Entypo} name="image"/>
            </Box>
          </Center>
        </Pressable>
        <Pressable flex="1">
          <Center>
            <Box p="3">
              <Icon size={6} as={Foundation} name="sound"/>
            </Box>
          </Center>
        </Pressable>
        <Pressable flex="1">
          <Center>
            <Box p="3">
              <Icon size={6} as={Ionicons} name="alarm-outline"/>
            </Box>
          </Center>
        </Pressable>
        <Pressable flex="1">
          <Center>
            <Box p="3">
              <Icon size={6} as={Ionicons} name="ios-shirt-outline"/>
            </Box>
          </Center>
        </Pressable>
      </HStack>
    </View>
  )
}
// https://images.unsplash.com/photo-1638292597251-6fe6b2ba50f9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60
var initialState = {
  title: '', text: '', list: [], image: [], doc: '', date: '',
  redo: [], saved: false, onList: false,
  inputList: '', dialogFont: false, selectFont: ''
}

export default function Create({route}){
  const toast = useToast()
  const store = useContext(ctx)
  const {key, onList} = route.params? route.params: {}
  const [state, dispatch] = useReducer((data, {type, payload}) => {
    switch(type){
      case "inputhandle":
        return{...data, [payload.name]: payload.value}
      case "pushimage":
        return{...data, image: [payload, ...data.image]}
      case "pushredo":
        return{...data, redo: [payload, ...data.redo]}
      case "deleteredo":
        return{...data, redo: data.redo.filter((d, key) => key !== 0)}
      case "saved":
        return{...data, saved: payload}
      case "handleonList":
        return{...data, onList: !data.onList}
      case "pushlist":
        return{...data, list: [payload, ...data.list]}
      case "setlist":
        return{...data, list: payload}
      case "deletelist":
        return{...data, list: data.list.filter((d,i) => i !== payload)}
      case "handledialogFont":
        return{...data, dialogFont: !data.dialogFont}
      case "handleselectFont":
        return{...data, selectFont: payload}
      default:
        return data
    }
  }, initialState)
  useEffect(() => {
    if(key !== undefined){
      if(store.note[key]){
        dispatch({type: 'saved', payload: key})
        dispatch({type: 'inputhandle', payload: {
          name: 'title', value: store.note[key].title || ''
        }})
        dispatch({type: 'inputhandle', payload: {
          name: 'text', value: store.note[key].text || ''
        }})
        dispatch({type: 'setlist', payload: store.note[key].list || []})
        dispatch({
          type: 'handleselectFont', payload: store.note[key].selectFont
        })
        dispatch({type: 'inputhandle', payload: {
          name: 'doc', value: store.note[key].id || ''
        }})
        dispatch({type: 'inputhandle', payload: {
          name: 'date', value: store.note[key].date || ''
        }})
      }
    }
  }, [key, store.note])
  useEffect(() => {
    if(onList){
      dispatch({type: 'handleonList'})
    }
  }, [onList])

  var inputhandle = (name, value) => dispatch({type: 'inputhandle', payload: {name, value}})
  , undo = () => {
    dispatch({type: 'pushredo', payload: state.text})
    var lastSpace = state.text.match(/\s\S+$/), value = ''
    if(lastSpace !== null){
      value = state.text.slice(0, lastSpace.index)
    }else{
      value = state.text.slice(0, state.text.length - 1)
    }
    dispatch({type: 'inputhandle', payload: {name: 'text', value: value}})
  }, redo = () => {
    if(state.redo[0]){
      dispatch({type: 'inputhandle', payload: {name: 'text', value: state.redo[0]}})
      dispatch({type: 'deleteredo'})
    }
  }, saved = async() => {
    var data = {
      user: store.user.uid,
      title: state.title,
      text: state.text,
      image: state.image,
      list: state.list,
      selectFont: state.selectFont,
      date: {
        seconds: Date.now() * 1000
      }
    }
    if(state.saved !== false){
      try{
        const update = await notes.update(state.doc, data)
        const doc = await notes.doc(state.doc)
        store.set({
          note: store.note.map((d, i) => {
            if(i === state.saved){
              var updated = Object.assign({...doc.data()}, {id: doc.id})
              return updated
            }
            return d
          })
        })
        toast.show({
          title: "Note has been updated!",
          status: "success",
          placement: "top",
        })

      }catch(e){
        alert(e.message)
      }
    }else{
      const add = await notes.add(data)
      const doc = await add.get()
      store.set({
        note: [Object.assign({...doc.data()}, {id: doc.id}), ...store.note]
      })
      dispatch({type: 'saved', payload: 0})
      toast.show({
        title: "Note has been saved!",
        status: "success",
        placement: "top",
      })
    }
  }, savedlist = () => {
    dispatch({type: 'pushlist', payload: state.inputList})
    inputhandle('inputList', '')
  }
  const [loaded] = useFonts({
    RobotoBold: require('../font/Roboto-Bold.ttf'),
    RobotoBoldItalic: require('../font/Roboto-BoldItalic.ttf'),
    RobotoItalic: require('../font/Roboto-Italic.ttf'),
    RobotoLight: require('../font/Roboto-Light.ttf'),
    RobotoLightItalic: require('../font/Roboto-LightItalic.ttf'),
    RobotoMedium: require('../font/Roboto-Medium.ttf'),
    RobotoMediumItalic: require('../font/Roboto-MediumItalic.ttf'),
    RobotoRegular: require('../font/Roboto-Regular.ttf'),
    RobotoThin: require('../font/Roboto-Thin.ttf'),
    RobotoThinItalic: require('../font/Roboto-ThinItalic.ttf'),
  })

  const dateTime = useMemo(() => {
    if(state.date.seconds){
      var date = new Date(state.date.seconds * 1000)
      return date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
    }else{
      return null
    }
  }, [state.date.seconds])
  return(
    <>
      <UserValid/>
      <TopBar state={state} undo={undo} redo={redo} saved={saved} />
      <ScrollView style={style.container}>
        {dateTime && <Box p="2">
          <Text>{dateTime}</Text>
        </Box>}
        <Input
          placeholder="Title"
          style={[style.noneBorder, style.bold]}
          onChangeText={(t) => inputhandle('title', t)}
          value={state.title}
          size="2xl"
        />
        <TextArea
          placeholder="Type Here"
          style={[style.noneBorder, state.selectFont? {fontFamily: state.selectFont.split(' ').join('')}: {}]}
          onChangeText={(t) => inputhandle('text', t)}
          value={state.text}
          size="xl"
        />
        <Divider/>
        <ScrollView horizontal={true}>
          <HStack>
            {
              state.image.map((img, key) => (
                <Image source={{uri: img}} size="xl" />
              ))
            }
          </HStack>
        </ScrollView>
        {state.onList && <HStack mt="2" p="2" space="2">
          <Input
            placeholder="Add List"
            flex="1"
            value={state.inputList}
            onChangeText={(t) => inputhandle('inputList', t)}
          />
          <Button onPress={savedlist}>Add</Button>
        </HStack>}
        <VStack mt="2">
        {
          state.list.map((d,i) => (
            <React.Fragment key={i}>
              <Divider/>
              <HStack space="2" p="2">
                <Checkbox
                  value={true}
                  defaultIsChecked={false}
                />
                <Pressable flex="1" onLongPress={() => dispatch({type: 'deletelist', payload: i})}>
                  <Text>{d}</Text>
                </Pressable>
              </HStack>
            </React.Fragment>
          ))
        }
        </VStack>
      </ScrollView>
      <BottomBar
        changeImage={(value) => dispatch({type: 'pushimage', payload: value})}
        handleList={() => dispatch({type: 'handleonList'})}
        handleFont={() => dispatch({type: 'handledialogFont'})}
      />
      <DialogFont
        handle={() => dispatch({type: 'handledialogFont'})}
        open={state.dialogFont}
        font={state.selectFont}
        changeFont={(value) => dispatch({type: 'handleselectFont', payload: value})}
      />
    </>
  )
}

var style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  containerTop: {
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 2
  },
  white: {
    backgroundColor: 'white'
  },
  noneBorder: {
    borderWidth: 0
  },
  bold: {
    fontWeight: 'bold'
  }
})