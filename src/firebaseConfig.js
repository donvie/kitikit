import firebase from '@firebase/app'
import '@firebase/firestore'
import '@firebase/auth'
import '@firebase/storage'

export const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyC8xmoUcos50MROfgfRPxJLpTlcjONHoc8',
  authDomain: 'kitikit-c21e4.firebaseapp.com',
  databaseURL: 'https://kitikit-c21e4.firebaseio.com',
  projectId: 'kitikit-c21e4',
  storageBucket: 'kitikit-c21e4.appspot.com',
  messagingSenderId: '256985935991',
  appId: '1:256985935991:web:b3df2f6563700120'
})
