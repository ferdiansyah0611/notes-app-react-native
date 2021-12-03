import React, { useMemo } from 'react'
import {
  View, Box, Heading, Pressable, Checkbox, HStack
} from 'native-base'
import { useNavigation } from '@react-navigation/native'
import ctx from '../store'

export default function ItemNote({data, keys, deleteNote}){
  const store = React.useContext(ctx)
  const date = useMemo(() => new Date(data.date.seconds ? data.date.seconds * 1000 : data.date), [data.date])
  const navigation = useNavigation()
  return(
    <View>
      <HStack alignItems="center" space="2">
        <Pressable onLongPress={deleteNote} flex="1" onPress={() => navigation.navigate('ShowNote', {key: keys})}>
          <Box bg="#ecf0f1" borderRadius="10" p="2" mt="2">
            <Heading size="md">{data.title}</Heading>
            <Box mt="1">
              <Heading size="xs" color="gray.500" variant="h5">
                {date.getHours()}:{date.getMinutes()} {date.getDate()}/{date.getMonth()}/{date.getFullYear()}
              </Heading>
            </Box>
          </Box>
        </Pressable>
      </HStack>
    </View>
  )
}