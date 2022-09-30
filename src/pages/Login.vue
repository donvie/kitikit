<template>
  <q-page>
    <div class="column">
      <div class="col-6 bg-brown">
        <div class="row full-height q-ma-xl">
          <div class="col-12 self-center text-center">
            <q-icon size="112px" name="img:statics/logo.png" />
          </div>
        </div>
      </div>
      <div class="col-4 q-mt-md">
        <div class="row q-ma-sm">
          <div class="col-12">
            <q-input color="brown" filled v-model="email" label="Email">
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-input color="brown" class="q-mt-xs" type="password" filled v-model="password" label="Password">
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-btn @click="emailLogin()" unelevated color="brown" size="lg" class="full-width q-mt-sm" label="Login" />
          </div>
          <div class="col-12">
            <q-btn @click="layoutCreateAccount = true" unelevated color="brown" dense flat class="full-width q-mt-xs" label="Create a new account" />
          </div>
        </div>
      </div>
      <div class="col-2 q-mt-md">
        <div class="row q-ma-sm">
          <div class="col-12">
            <q-btn :loading="loggedInFB" @click="facebookLogin" unelevated icon="ion-logo-facebook" class="full-width" color="primary" size="lg" label="Sign in with facebook" />
          </div>
          <div class="col-12">
            <q-btn unelevated icon="ion-logo-google" class="full-width q-mt-sm" color="red" size="lg" label="Sign in with Google" />
          </div>
          <div class="col-12 text-center">
            <q-toggle
              v-model="switchUser"
              @input="ToggleUser(switchUser)"
              color="brown"
              class="q-mt-sm text-weight-bold"
              :label="switchUser ? 'Log in as Customer' : 'Log in as Owner'"
            />
          </div>
        </div>
      </div>
    </div>

    <q-dialog transition-show="slide-left" transition-hide="slide-right" persistent maximized v-model="layoutUpdateProfile">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-brown">
          <q-toolbar>
            <q-btn flat @click="goBack()" round dense icon="arrow_back" />
            <q-toolbar-title>Update Profile</q-toolbar-title>
            <q-btn flat :loading="show" @click="Submit()" round dense icon="check" />
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page padding>
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-uploader
                  hide-upload-btn
                  @added="addFile"
                  @removed="removeFile"
                  class="full-width"
                  color="brown-6"
                  url=""
                  label="Update Profile Picture"
                  ref="uploader"
                />
              </div>
              <div class="col-12">
                <q-input disable color="brown" class="q-mt-xs" filled v-model="newEmail" label="Email" />
              </div>
              <div class="col-12">
                <q-input color="brown" class="q-mt-xs" filled v-model="newDisplayName" :label="this.$q.localStorage.getItem('switchAccount') ? 'Name' : 'Name of Establishment'" />
              </div>
              <div class="col-12">
                <q-select v-model="gender" class="q-mt-xs" filled :options="optionsGender" label="Gender" />
              </div>
              <div class="col-12">
                <q-input color="brown" class="q-mt-xs" filled v-model="newPhoneNumber" label="Phone Number" />
              </div>
              <div class="col-12">
                <q-input color="brown" class="q-mt-xs" filled v-model="completeAddress" label="Complete Address" />
              </div>
            </div>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

    <q-dialog transition-show="slide-left" transition-hide="slide-right" persistent maximized v-model="layoutCreateAccount">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-brown">
          <q-toolbar>
            <q-btn flat @click="layoutCreateAccount = false" round dense icon="arrow_back" />
            <q-toolbar-title>Create Account</q-toolbar-title>
            <q-btn flat :loading="signUpLoading" @click="signUp()" round dense icon="check" />
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page padding>
            <div class="row">
              <div class="col-12">
                <q-input color="brown" class="q-mt-xs" filled v-model="email" label="Email" />
              </div>
              <div class="col-12">
                <q-input color="brown" class="q-mt-xs" type="password" filled v-model="password" label="Password" />
              </div>
            </div>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

  </q-page>
</template>

<script>
import firebase from '@firebase/app'
export default {
  props: {
    firebase: Object
  },
  data () {
    return {
      loggedInFB: false,
      signUpLoading: false,
      user: null,
      email: '',
      password: null,
      newEmail: '',
      newDisplayName: '',
      newPhoneNumber: null,
      completeAddress: '',
      layoutUpdateProfile: false,
      docRef: null,
      layoutCreateAccount: false,
      switchUser: false,
      file: null,
      show: false,
      gender: '',
      optionsGender: [
        'Male', 'Female'
      ]
    }
  },
  mounted () {
    this.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user

        if (this.$q.localStorage.getItem('switchAccount') === true) {
          this.docRef = this.firebase.firestore().collection('customers').doc(user.uid)
          this.docRef.get().then((doc) => {
            if (!doc.exists) {
              this.newEmail = user.email
              this.newDisplayName = user.displayName
              this.newPhoneNumber = user.phoneNumber
              this.completeAddress = this.completeAddress
              this.layoutUpdateProfile = true
            } else {
              this.$router.push('/')
            }
          }).catch((error) => {
            console.log('Error getting document:', error)
          })
        } else {
          this.docRef = this.firebase.firestore().collection('owners').doc(user.uid)
          this.docRef.get().then((doc) => {
            if (!doc.exists) {
              this.newEmail = user.email
              this.newDisplayName = user.displayName
              this.newPhoneNumber = user.phoneNumber
              this.completeAddress = this.completeAddress
              this.layoutUpdateProfile = true
            } else {
              this.$router.push('/browse_owner')
            }
          }).catch((error) => {
            console.log('Error getting document:', error)
          })
        }
      } else {
        this.user = null
      }
    })
    if (this.$q.localStorage.has('switchAccount')) {
      this.switchUser = this.$q.localStorage.getItem('switchAccount')
    }
  },
  methods: {
    async ToggleUser (value) {
      this.$q.localStorage.set('switchAccount', value)
    },
    async facebookLogin () {
      this.loggedInFB = true
      await this.firebase.auth().signInWithRedirect(new firebase.auth.FacebookAuthProvider())
      this.loggedInFB = false
    },
    async emailLogin () {
      if (this.email !== '' && this.password !== null) {
        await this.firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch((error) => {
          if (error.code === 'auth/user-not-found') {
            this.$q.notify({
              icon: 'close',
              message: 'User not found.',
              timeout: 800,
              color: 'negative',
              textColor: 'white',
              position: 'bottom-left'
            })
          }
        })
      } else {
        this.$q.notify({
          icon: 'close',
          message: 'Email or Password can not be empty.',
          timeout: 800,
          color: 'negative',
          textColor: 'white',
          position: 'bottom-left'
        })
      }
    },
    async goBack () {
      await this.firebase.auth().signOut()
      this.layoutUpdateProfile = false
    },
    async signUp () {
      this.signUpLoading = true
      if (this.email !== '' && this.password !== null) {
        await this.firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch((error) => {
          this.signUpLoading = false
          if (error.code === 'auth/email-already-in-use') {
            this.$q.notify({
              icon: 'close',
              message: 'Email already in use.',
              timeout: 800,
              color: 'negative',
              textColor: 'white',
              position: 'bottom-left'
            })
          }
        })
      } else {
        this.$q.notify({
          icon: 'close',
          message: 'Email or Password can not be empty.',
          timeout: 800,
          color: 'negative',
          textColor: 'white',
          position: 'bottom-left'
        })
      }
    },
    removeFile (file) {
      console.log(file)
    },
    addFile (file) {
      this.file = file
    },
    Submit () {
      this.show = true
      let user = null
      if (this.$q.localStorage.getItem('switchAccount') === true) {
        user = 'customers'
      } else {
        user = 'owners'
      }

      if (this.file === null) {
        this.docRef.set({
          displayName: this.newDisplayName,
          email: this.user.email,
          phoneNumber: this.newPhoneNumber,
          photoURL: this.user.photoURL,
          uid: this.user.uid,
          gender: this.gender,
          completeAddress: this.completeAddress,
          createdAt: Date.now()
        }).then(() => {
          this.show = false
          this.$q.notify({
            icon: 'check',
            message: 'You have successfully signed in.',
            timeout: 800,
            color: 'brown',
            textColor: 'white',
            position: 'bottom-left'
          })
          this.$router.push('/')
        }).catch((error) => {
          console.error('Error writing document: ', error)
        })
      } else {
        var uploadTask = this.firebase.storage().ref(user + '/' + this.user.uid + '/' + this.file[0].name).put(this.file[0])
        uploadTask.on('state_changed', (snapshot) => {
        }, (error) => {
          console.error(error)
        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.docRef.set({
              displayName: this.newDisplayName,
              email: this.user.email,
              phoneNumber: this.newPhoneNumber,
              photoURL: downloadURL,
              gender: this.gender,
              uid: this.user.uid,
              completeAddress: this.completeAddress,
              createdAt: Date.now()
            }).then(() => {
              this.show = false
              this.$q.notify({
                icon: 'check',
                message: 'You have successfully signed in.',
                timeout: 800,
                color: 'brown',
                textColor: 'white',
                position: 'bottom-left'
              })
              this.$router.push('/')
            }).catch((error) => {
              console.error('Error writing document: ', error)
            })
          })
        })
      }
    }
  }
}
</script>

<style>

</style>
