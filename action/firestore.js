import firebase, { firestore } from '../fb'

const date = () => firebase.firestore.FieldValue.serverTimestamp()

export const notes = {
  collection: firestore.collection('notes'),
  add(data){
    data.date = date()
    return this.collection.add(data)
  },
  remove(doc){
    return this.collection.doc(doc).delete()
  },
  update(doc, data){
    data.date = date()
    return this.collection.doc(doc).update(data)
  },
  get(user){
    return this.collection.where('user', '==', user).get()
  },
  doc(doc){
    return this.collection.doc(doc).get()
  }
}