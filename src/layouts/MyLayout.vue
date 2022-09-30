<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-show="$route.path !== '/login'" reveal class="bg-brown" bordered>
      <q-toolbar>

        <q-btn flat dense round  aria-label="Menu" @click="$router.push('/')">
          <q-avatar size="36px">
            <img src="statics/logo.png">
          </q-avatar>
        </q-btn>

        <q-toolbar-title>
          {{$route.name}}
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-footer v-if="user !== null && user.length !== 0" bordered class="bg-white text-brown">
      <q-tabs align="justify" no-caps dense active-color="brown" indicator-color="transparent" class="text-grey">
        <q-route-tab v-if="$q.localStorage.getItem('switchAccount') === true" to="/" exact icon="store" label="Browse" />
        <q-route-tab v-if="$q.localStorage.getItem('switchAccount') === false" to="/browse_owner" exact icon="store" label="Browse" />
        <q-route-tab v-if="$q.localStorage.getItem('switchAccount') === false" to="/myproduct" exact icon="shopping_cart" label="My Product" />
        <q-route-tab to="/message" exact icon="mail" label="Inbox" />
        <q-route-tab to="/account" exact icon="person" label="Account" />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view :firebase="firebase" :user="user" />
    </q-page-container>
  </q-layout>
</template>

<script>

import { firebaseApp } from 'src/firebaseConfig.js'

export default {
  name: 'MyLayout',
  data () {
    return {
      user: null,
      firebase: firebaseApp,
      docRef: null
    }
  },
  mounted () {
    this.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (this.$q.localStorage.getItem('switchAccount') === true) {
          this.$binding('user', this.firebase.firestore().collection('customers').doc(user.uid)).then((user) => {
          })
        } else {
          this.$binding('user', this.firebase.firestore().collection('owners').doc(user.uid)).then((user) => {
          })
        }
      } else {
        this.user = null
        this.$router.push('/login')
      }
    })
  }
}
</script>

<style>
</style>
