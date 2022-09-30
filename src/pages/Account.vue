<template>
  <q-page>
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label overline>Welcome,</q-item-label>
          <q-item-label class="text-h6" v-if="user">{{user.displayName}}</q-item-label>
          <q-item-label @click="updateView" overline v-if="user">Edit Profile <q-icon name="edit" /></q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-avatar style="height: 80px; width: 80px;">
            <img v-if="user" :src="user.photoURL ? user.photoURL : 'statics/no_profile.png'">
          </q-avatar>
        </q-item-section>
      </q-item>

      <q-item-label header>Info</q-item-label>

      <q-item clickable v-ripple>
        <q-item-section top avatar>
          <q-avatar color="brown" text-color="white" icon="email" />
        </q-item-section>
        <q-item-section>
          <q-item-label caption>Email</q-item-label>
          <q-item-label>{{user.email}}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset="item" />

      <q-item clickable v-ripple>
        <q-item-section top avatar>
          <q-avatar color="brown" text-color="white" icon="smartphone" />
        </q-item-section>
        <q-item-section>
          <q-item-label caption>Phone Number</q-item-label>
          <q-item-label>{{user.phoneNumber}}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset="item" />

      <q-item clickable v-ripple>
        <q-item-section top avatar>
          <q-avatar color="brown" text-color="white" icon="location_on" />
        </q-item-section>
        <q-item-section>
          <q-item-label caption>Complete Address</q-item-label>
          <q-item-label>{{user.completeAddress === '' ? 'none' : user.completeAddress}}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section top avatar>
          <q-avatar color="brown" text-color="white" icon="location_on" />
        </q-item-section>
        <q-item-section>
          <q-item-label caption>Gender</q-item-label>
          <q-item-label>{{user.gender === '' ? 'none' : user.gender}}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset="item" />

      <q-item @click.native="signOut" clickable v-ripple>
        <q-item-section>
          <q-btn icon="exit_to_app" color="brown" label="Logout" unelevated />
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog maximized transition-show="slide-left" transition-hide="slide-right" v-model="layoutEditAccount">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-brown">
          <q-toolbar>
            <q-btn flat @click="layoutEditAccount = false" round dense icon="arrow_back" />
            <q-toolbar-title>Edit Account</q-toolbar-title>
            <q-btn flat :loading="show" @click="updateAccount()" dense label="Update" icon="update" />
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
                  label="Upload Profile Picture"
                  ref="uploader"
                />
              </div>
              <div class="col-12">
                <q-input disable color="brown" class="q-mt-xs" filled :value="user.email" disabled label="Email" />
              </div>
              <div class="col-12">
                <q-input color="brown" class="q-mt-xs" filled v-model="updateDisplayName" :label="this.$q.localStorage.getItem('switchAccount') ? 'Name' : 'Name of Establishment'" />
              </div>
              <div class="col-12">
                <q-select v-model="updateGender" class="q-mt-xs" filled :options="optionsGender" label="Gender" />
              </div>
              <div class="col-12">
                <q-input color="brown" class="q-mt-xs" filled v-model="updatePhoneNumber" label="Phone Number" />
              </div>
              <div class="col-12">
                <q-input color="brown" class="q-mt-xs" filled v-model="updatecompleteAddress" label="Complete Address" />
              </div>
            </div>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

  </q-page>
</template>

<script>
export default {
  props: {
    user: Object,
    firebase: Object
  },
  data () {
    return {
      layoutEditAccount: false,
      updateEmail: '',
      updateDisplayName: '',
      updatePhoneNumber: '',
      updatecompleteAddress: '',
      updateGender: '',
      optionsGender: [
        'Male', 'Female'
      ],
      file: null,
      show: false
    }
  },
  created () {
  },
  methods: {
    updateView () {
      this.layoutEditAccount = true
      this.updateDisplayName = this.user.displayName
      this.updatePhoneNumber = this.user.phoneNumber
      this.updateGender = this.user.gender
      this.updatecompleteAddress = this.user.completeAddress
    },
    removeFile (file) {
      console.log(file)
    },
    addFile (file) {
      this.file = file
    },
    updateAccount () {
      this.show = true
      let user = null
      if (this.$q.localStorage.getItem('switchAccount') === true) {
        user = 'customers'
      } else {
        user = 'owners'
      }

      if (this.file === null) {
        this.firebase.firestore().collection(user).doc(this.user.uid).update({
          displayName: this.updateDisplayName,
          phoneNumber: this.updatePhoneNumber,
          completeAddress: this.updatecompleteAddress,
          gender: this.updateGender
        }).then((data) => {
          this.show = false
          this.$q.notify({
            icon: 'check',
            message: 'You have successfully updated.',
            timeout: 800,
            color: 'brown',
            textColor: 'white',
            position: 'bottom-left'
          })
        }).catch(err => {
          console.error(err)
        })
      } else {
        var uploadTask = this.firebase.storage().ref(user + '/' + this.user.uid + '/' + this.file[0].name).put(this.file[0])
        uploadTask.on('state_changed', (snapshot) => {
        }, (error) => {
          console.error(error)
        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.firebase.firestore().collection(user).doc(this.user.uid).update({
              displayName: this.updateDisplayName,
              phoneNumber: this.updatePhoneNumber,
              completeAddress: this.updatecompleteAddress,
              photoURL: downloadURL,
              gender: this.updateGender
            }).then((data) => {
              this.show = false
              this.$q.notify({
                icon: 'check',
                message: 'You have successfully updated.',
                timeout: 800,
                color: 'brown',
                textColor: 'white',
                position: 'bottom-left'
              })
            }).catch(err => {
              console.error(err)
            })
          })
        })
      }
    },
    async signOut () {
      await this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to logout?',
        ok: {
          color: 'brown'
        },
        cancel: {
          color: 'brown',
          flat: true
        },
        persistent: true
      }).onOk(() => {
        this.$q.loading.show()
        this.timer = setTimeout(() => {
          this.$q.loading.hide()
          this.timer = void 0
          this.firebase.auth().signOut()
          this.$router.push('/login')
        }, 3000)
      }).onCancel(() => {
      })
    },
    beforeDestroy () {
      if (this.timer !== void 0) {
        clearTimeout(this.timer)
        this.$q.loading.hide()
      }
    }
  }
}
</script>

<style>

</style>
