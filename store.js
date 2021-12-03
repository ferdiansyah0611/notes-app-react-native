import { createContext } from 'react'

const store = createContext({
  name: '',
  note: [],
  search: '',
  user: null
})

export default store