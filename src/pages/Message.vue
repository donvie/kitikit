<template>
  <q-page>
    <q-list>
      <q-item @click="viewChat(contact)" v-for="contact in filteredContacts" :key="contact['.key']" class="q-my-sm" clickable v-ripple>
        <q-item-section avatar>
          <q-avatar color="brown">
            <img :src="contact.photoURL !== null ? contact.photoURL : 'statics/no_profile.png'">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ contact.displayName }}</q-item-label>
          <q-item-label caption lines="1">{{ contact.text[0] }}</q-item-label>
          <q-item-label caption lines="1">
            <vue-moments-ago prefix="" suffix="ago" :date="`${date.formatDate(contact.stamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ')}`"></vue-moments-ago>
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="chat_bubble" color="brown-4" />
        </q-item-section>
      </q-item>
      <q-item v-if="filteredContacts.length === 0" class="text-center">
        <q-item-section>
          <q-item-label class="text-subtitle1"><q-icon color="brown" size="70px" name="sentiment_very_dissatisfied" /><br>No Message yet</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="layoutChat" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-brown">
          <q-toolbar>
            <q-btn flat @click="layoutChat = false" round dense icon="arrow_back" />
            <q-toolbar-title>Chat</q-toolbar-title>
          </q-toolbar>
        </q-header>

        <q-footer class="bg-white">
          <q-input class="q-ma-xs" color="brown" v-model="message" autogrow borderless filled placeholder="Enter message">
            <template v-slot:after>
              <q-btn @click="sendMessage()" round dense flat icon="send" />
            </template>
          </q-input>
        </q-footer>

        <q-page-container>
          <q-page padding>
            <div class="layout-padding" style="height: 80vh; overflow-y:auto" ref="messagesDiv">
              <q-chat-message
                v-for="message in filteredMessage"
                :key="message['.key']"
                :name="message.displayName"
                :avatar="message.photoURL !== null ? message.photoURL : 'statics/no_profile.png'"
                :text="[message.text]"
                :sent="user.uid === message.from"
                size="5"
                :stamp="`${date.formatDate(message.stamp, 'MMM D HH:mm A')}`"
              />
            </div>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

  </q-page>
</template>

<script>

import lodash from 'lodash'
import VueMomentsAgo from 'vue-moments-ago'
import { date } from 'quasar'

export default {
  components: {
    VueMomentsAgo
  },
  props: {
    firebase: Object,
    user: Object
  },
  data () {
    return {
      date,
      layoutChat: false,
      message: '',
      messages: [],
      contacts: [],
      messagesFromTo: [],
      messagesToFrom: [],
      productData: null
    }
  },
  mounted () {
    this.$binding('contacts', this.firebase.firestore().collection('messages').where('to', '==', this.user.uid).orderBy('stamp', 'desc'))
    this.loadData()
  },
  computed: {
    filteredContacts () {
      return lodash.uniqBy(this.contacts, 'from')
    },
    filteredMessage () {
      let sorted = this.messagesFromTo.concat(this.messagesToFrom).sort(function (a, b) {
        return a.stamp - b.stamp
      })
      return sorted
    }
  },
  methods: {
    viewChat (contact) {
      this.$q.localStorage.set('productData1', contact)
      this.productData = contact
      this.loadData()
      this.layoutChat = true
      this.scrollChat()
    },
    loadData () {
      if (this.$q.localStorage.getItem('productData1')) {
        if (this.$q.localStorage.getItem('switchAccount') === true) {
          this.$binding('messagesFromTo', this.firebase.firestore().collection('messages').orderBy('stamp', 'asc').where('from', '==', this.user.uid).where('to', '==', this.$q.localStorage.getItem('productData1').from))
          this.$binding('messagesToFrom', this.firebase.firestore().collection('messages').orderBy('stamp', 'asc').where('to', '==', this.user.uid).where('from', '==', this.$q.localStorage.getItem('productData1').from))
        } else {
          this.$binding('messagesFromTo', this.firebase.firestore().collection('messages').orderBy('stamp', 'asc').where('from', '==', this.user.uid).where('to', '==', this.$q.localStorage.getItem('productData1').from))
          this.$binding('messagesToFrom', this.firebase.firestore().collection('messages').orderBy('stamp', 'asc').where('to', '==', this.user.uid).where('from', '==', this.$q.localStorage.getItem('productData1').from))
        }
      }
    },
    sendMessage () {
      this.firebase.firestore().collection('messages').add({
        displayName: this.user.displayName,
        photoURL: this.user.photoURL,
        stamp: Date.now(),
        text: [this.message],
        from: this.user.uid,
        to: this.productData.from
      })
      this.scrollChat()
      this.message = ''
    },
    scrollChat () {
      this.$nextTick(() => {
        const node = this.$refs.messagesDiv
        if (node) {
          setTimeout(function () {
            node.scrollTop = node.scrollHeight
          }, 100)
        }
      })
    }
  }
}
</script>

<style>

</style>
