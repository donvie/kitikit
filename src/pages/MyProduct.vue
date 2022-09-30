<template>
  <q-page style="background: linear-gradient(172deg, #d7ccc8 60%, #fff 60%); margin-top: 66px;">
    <q-infinite-scroll :disable="scroll" @load="onLoad" :offset="250">
      <div class="q-ma-md">
        <div class="row q-col-gutter-md">
          <div v-for="product in products" :key="product['.key']" class="col-xs-6  col-sm-4 col-md-2 col-lg-2 col-xl-2">
            <q-card square bordered>
              <q-img style="height: 150px;" :src="product.images ? product.images[0] : 'https://cdn.quasar.dev/img/parallax2.jpg'">
                <div style="padding: 5px;" class="absolute-top-right bg-transparent">
                  <q-btn @click="viewEditProduct(product)" icon="edit" round unelevated dense color="brown" />
                </div>
                <div style="padding: 5px;" class="absolute-top-left bg-transparent">
                  <q-btn @click.native="deleteProduct(product)" icon="delete" round dense unelevated color="brown" />
                </div>
              </q-img>

              <q-card-section style="padding: 5px;">
                <div class="text-caption text-black">Product Name: {{product.productName}}</div>
                <div class="text-caption text-black">Seller: {{product.displayName}}</div>
                <div class="text-caption text-black">Owner: {{product.owner}}</div>
                <div class="text-caption text-black">Contact: {{product.contactInformation}}</div>
              </q-card-section>

              <q-card-actions class="justify-center" style="padding: 6px;">
                <q-btn @click="viewMoreClick(product)" size="sm" color="brown" no-caps dense unelevated>View details</q-btn>
                <q-btn v-if="product.images" no-caps size="sm" unelevated @click.native="viewImageClick(product)" :label="product.images.length + ' ' + `${product.images.length === 1 ? 'Image' : 'Images'}`" dense color="brown" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="brown" size="50px" />
        </div>
      </template>
    </q-infinite-scroll>

    <q-dialog transition-show="slide-left" transition-hide="slide-right" persistent maximized v-model="layoutAddProduct">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-brown">
          <q-toolbar>
            <q-btn flat @click="layoutAddProduct = false" round dense icon="arrow_back" />
            <q-toolbar-title>Add Product</q-toolbar-title>
            <q-btn @click="addProduct()" :loading="loading" flat label="save" dense icon="save" />
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page padding>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input color="brown" filled v-model="productName" label="Product Name" />
              </div>
              <div class="col-12">
                <q-select color="brown" filled v-model="category" :options="optionsCategory" label="Category" />
              </div>
              <div class="col-12">
                <q-input color="brown" filled v-model="owner" label="Owner" />
              </div>
              <div class="col-12">
                <q-input color="brown" type="number" filled v-model="price" label="Price" />
              </div>
              <div class="col-12">
                <q-input color="brown" filled v-model="contactInformation" label="Contact Information" />
              </div>
              <div class="col-12">
                <q-input color="brown" type="textarea" autogrow filled v-model="productDetails" label="Product Details" />
              </div>
              <div class="col-12">
                <q-uploader
                  hide-upload-btn
                  @added="addFile"
                  @removed="removeFile"
                  class="full-width"
                  color="brown-6"
                  url=""
                  label="Upload images"
                  :multiple="true"
                  ref="uploader"
                />
              </div>
            </div>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click="layoutAddProduct =! layoutAddProduct" round color="brown" size="lg" icon="add" />
    </q-page-sticky>

    <q-dialog v-model="viewMore" transition-show="rotate" transition-hide="rotate">
      <q-card style="width: 90vw;">
        <q-card-section class="row items-center">
          <div class="text-h6">Product Details</div>
          <q-space />
          <q-btn label="Close" icon="close" flat color="brown" dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <pre v-html="productData.productDetails"></pre>
        </q-card-section>

      </q-card>
    </q-dialog>

    <q-dialog full-width v-model="viewImage">
      <q-carousel
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        thumbnails
        v-model="slide"
        arrows
        control-color="brown"
        navigation-icon="radio_button_unchecked"
        navigation
        padding
        height="80vh"
        class="bg-white shadow-1 rounded-borders"
      >
        <q-carousel-slide v-for="(product, index) in productData.images" :key="index" :name="index">
          <div class="q-mt-xl text-center">
            <q-img style="width: 100%;" :src="product">
              <div style="padding: 5px;" class="absolute-top-right bg-transparent">
                <q-btn @click="deleteImage(index)" icon="delete" label="Delete image" dense unelevated color="negative" />
              </div>
            </q-img>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-dialog>

    <q-dialog transition-show="slide-left" transition-hide="slide-right" persistent maximized v-model="layoutEditProduct">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-brown">
          <q-toolbar>
            <q-btn flat @click="layoutEditProduct = false" round dense icon="arrow_back" />
            <q-toolbar-title>Edit Product</q-toolbar-title>
            <q-btn @click="editProduct()" :loading="loading" flat label="Update" dense icon="update" />
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page padding>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input color="brown" filled v-model="updateProductName" label="Product Name" />
              </div>
              <div class="col-12">
                <q-select color="brown" filled v-model="updateCategory" :options="optionsCategory" label="Category" />
              </div>
              <div class="col-12">
                <q-input color="brown" filled v-model="updateOwner" label="Owner" />
              </div>
              <div class="col-12">
                <q-input color="brown" type="number" filled v-model="updatePrice" label="Price" />
              </div>
              <div class="col-12">
                <q-input color="brown" filled v-model="updateContactInformation" label="Contact Information" />
              </div>
              <div class="col-12">
                <q-input color="brown" type="textarea" autogrow filled v-model="updateProductDetails" label="Product Details" />
              </div>
              <div class="col-12">
                <q-uploader
                  hide-upload-btn
                  @added="addFile"
                  @removed="removeFile"
                  class="full-width"
                  color="brown-6"
                  url=""
                  label="Upload images"
                  :multiple="true"
                  ref="uploader"
                />
              </div>
            </div>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

    <q-page-sticky expand position="top">
      <q-toolbar class="bg-brown-5 text-white">
        <q-space />
        <q-input placeholder="Search product name..." @input="filteredSearch" dark dense standout v-model="search" input-class="text-right" class="col-12">
          <template v-slot:append>
            <q-icon v-if="search === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''; filteredSearch()" />
          </template>
        </q-input>
      </q-toolbar>
    </q-page-sticky>

  </q-page>
</template>

<style>
</style>

<script>
import { setTimeout } from 'timers'
export default {
  name: 'MyProduct',
  props: {
    firebase: Object,
    user: Object
  },
  data () {
    return {
      updateProductName: '',
      updateCategory: '',
      updatePrice: 0,
      updateContactInformation: '',
      updateProductDetails: '',
      layoutEditProduct: false,
      scroll: false,
      loading: false,
      owner: '',
      productName: '',
      category: '',
      price: 0,
      contactInformation: '',
      productDetails: '',
      optionsCategory: [
        'Utensil',
        'decoratives',
        'Religious statue',
        'Toy',
        'Souvenir',
        'Kitchenware',
        'furniture'
      ],
      search: '',
      products: [],
      files: [],
      layoutAddProduct: false,
      productData: '',
      updateOwner: '',
      slide: 0,
      viewMore: false,
      viewImage: false,
      docRefID: ''
    }
  },
  mounted () {
    if (this.user) {
      this.loadData()
    }
  },
  methods: {
    loadData () {
      this.$binding('products', this.firebase.firestore().collection('products').limit(4).orderBy('createdAt', 'asc').where('uid', '==', this.user.uid))
    },
    filteredSearch () {
      if (this.search !== '') {
        this.$binding('products', this.firebase.firestore().collection('products').limit(4).where('productName', '>=', this.search).where('productName', '<=', this.search + 'z').where('uid', '==', this.user.uid))
      } else {
        this.scroll = false
        this.loadData()
      }
    },
    async deleteImage (index) {
      await this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to Delete?',
        ok: {
          color: 'brown'
        },
        cancel: {
          color: 'brown',
          flat: true
        },
        persistent: true
      }).onOk(() => {
        this.firebase.firestore().collection('products').doc(this.productData['.key']).update({
          images: this.productData.images.splice(index, 1)
        }).then((data) => {
          this.$q.notify({
            icon: 'check',
            message: 'You have successfully deleted.',
            timeout: 800,
            color: 'brown',
            textColor: 'white',
            position: 'bottom-left'
          })
        }).catch((error) => {
          console.error(error)
        })
      }).onCancel(() => {
      })
    },
    viewEditProduct (product) {
      this.productData = product
      this.updateProductName = product.productName
      this.updateCategory = product.category
      this.updatePrice = product.price
      this.updateOwner = product.owner
      this.updateContactInformation = product.contactInformation
      this.updateProductDetails = product.productDetails
      this.layoutEditProduct = true
    },
    editProduct () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to continue?',
        ok: {
          color: 'brown'
        },
        cancel: {
          color: 'brown',
          flat: true
        },
        persistent: true
      }).onOk(() => {
        this.loading = true
        this.firebase.firestore().collection('products').doc(this.productData['.key']).update({
          productName: this.updateProductName,
          category: this.updateCategory,
          price: this.updatePrice,
          contactInformation: this.updateContactInformation,
          productDetails: this.updateProductDetails,
          owner: this.updateOwner
        }).then((docRef) => {
          if (this.files.length !== 0) {
            const promises = []
            this.files.forEach(file => {
              var storageRef = this.firebase.storage().ref('products/' + this.user.uid + '/' + this.productData['.key'] + '/' + file.name)
              promises.push(storageRef.put(file).then((snapshot) => {
                return snapshot.ref.getDownloadURL()
              }).then((downloadURL) => {
                return downloadURL
              })
              )
            })
            return Promise.all(promises)
          }
        }).then((url) => {
          if (this.files.length !== 0) {
            this.firebase.firestore().collection('products').doc(this.productData['.key']).update({
              images: this.productData.images.concat(url)
            }).then((data) => {
              this.scroll = false
              this.loading = false
              this.$refs.uploader.$data.files = []
              this.files = []
            }).catch(err => {
              console.error(err)
            })
          } else {
            this.scroll = false
            this.loading = false
            this.$q.notify({
              icon: 'check',
              message: 'You have successfully updated.',
              timeout: 800,
              color: 'brown',
              textColor: 'white',
              position: 'bottom-left'
            })
          }
        }).catch((error) => {
          console.error('Error adding document: ', error)
        })
      }).onCancel(() => {
      })
    },
    viewImageClick (product) {
      this.productData = product
      this.viewImage = true
    },
    viewMoreClick (product) {
      this.productData = product
      this.viewMore = true
    },
    addFile (file) {
      this.files.push(file[0])
    },
    removeFile (file) {
      let index = this.files.findIndex(f => f.name === file[0].name)
      this.files.splice(index, 1)
    },
    async deleteProduct (product) {
      await this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to Delete?',
        ok: {
          color: 'brown'
        },
        cancel: {
          color: 'brown',
          flat: true
        },
        persistent: true
      }).onOk(() => {
        this.firebase.firestore().collection('products').doc(product['.key']).delete()
      }).onCancel(() => {
      })
    },
    addProduct () {
      if (this.productName === '' || this.category === '' || this.price === 0 || this.contactInformation === '' || this.productDetails === '' || this.files.length === 0) {
        this.$q.notify({
          icon: 'close',
          message: 'Fields can not be empty.',
          timeout: 800,
          color: 'negative',
          textColor: 'white',
          position: 'bottom-left'
        })
      } else {
        this.$q.dialog({
          title: 'Confirm',
          message: 'Are you sure you want to continue?',
          ok: {
            color: 'brown'
          },
          cancel: {
            color: 'brown',
            flat: true
          },
          persistent: true
        }).onOk(() => {
          this.loading = true
          this.firebase.firestore().collection('products').add({
            productName: this.productName,
            category: this.category,
            price: this.price,
            contactInformation: this.contactInformation,
            productDetails: this.productDetails,
            displayName: this.user.displayName,
            phoneNumber: this.user.phoneNumber,
            owner: this.owner,
            uid: this.user.uid,
            createdAt: Date.now()
          }).then((docRef) => {
            this.docRefID = docRef.id
            const promises = []
            this.files.forEach(file => {
              var storageRef = this.firebase.storage().ref('products/' + this.user.uid + '/' + docRef.id + '/' + file.name)
              promises.push(storageRef.put(file).then((snapshot) => {
                return snapshot.ref.getDownloadURL()
              }).then((downloadURL) => {
                return downloadURL
              })
              )
            })
            return Promise.all(promises)
          }).then((url) => {
            this.firebase.firestore().collection('products').doc(this.docRefID).update({
              images: url
            }).then((data) => {
              this.scroll = false
              this.loading = false
              this.$refs.uploader.$data.files = []
              this.productName = ''
              this.category = ''
              this.price = 0
              this.contactInformation = ''
              this.productDetails = ''
              this.owner = ''
              this.$q.notify({
                icon: 'check',
                message: 'You have successfully added.',
                timeout: 800,
                color: 'brown',
                textColor: 'white',
                position: 'bottom-left'
              })
            }).catch(err => {
              console.error(err)
            })
          }).catch((error) => {
            console.error('Error adding document: ', error)
          })
        }).onCancel(() => {
        })
      }
    },
    onLoad (index, done) {
      setTimeout(() => {
        if (this.products) {
          if (this.products.length === 0) {
            this.scroll = true
          } else {
            var first = null
            if (this.search === '') {
              first = this.firebase.firestore().collection('products').orderBy('createdAt').limit(this.products.length).where('uid', '==', this.user.uid)
            } else {
              first = this.firebase.firestore().collection('products').where('uid', '==', this.user.uid).where('productName', '>=', this.search).where('productName', '<=', this.search + 'z').limit(this.products.length)
            }
            return first.get().then((documentSnapshots) => {
              var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1]

              if (this.search === '') {
                this.firebase.firestore().collection('products').where('uid', '==', this.user.uid).orderBy('createdAt').startAfter(lastVisible).limit(4).get().then((querySnapshot) => {
                  if (querySnapshot.size === 0) {
                    this.scroll = true
                  }
                  querySnapshot.forEach((doc) => {
                    this.products.push(doc.data())
                    done()
                  })
                })
              } else {
                this.firebase.firestore().collection('products').where('uid', '==', this.user.uid).where('productName', '>=', this.search).where('productName', '<=', this.search + 'z').startAfter(lastVisible).limit(4).get().then((querySnapshot) => {
                  if (querySnapshot.size === 0) {
                    this.scroll = true
                  }
                  querySnapshot.forEach((doc) => {
                    this.products.push(doc.data())
                    done()
                  })
                })
              }
            })
          }
        }
      }, 2000)
    }
  }
}
</script>
