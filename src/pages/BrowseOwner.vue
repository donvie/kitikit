<template>
  <q-page style="background: linear-gradient(172deg, #d7ccc8 60%, #fff 60%); margin-top: 66px;">
    <q-infinite-scroll :disable="scroll" color="brown" @load="onLoad" :offset="250">
      <div class="q-ma-md">
        <div class="row q-col-gutter-md">
          <div v-for="(product, index) in products" :key="index" class="col-xs-6  col-sm-4 col-md-2 col-lg-2 col-xl-2">
            <q-card square bordered>
              <q-img style="height: 150px;" :src="product.images[0]">
                <div style="padding: 5px;" class="absolute-bottom">
                  <div class="text-subtitle2 text-yellow text-weight-bold">Php {{product.price | currency('')}}</div>
                </div>
              </q-img>

              <q-card-section style="padding: 5px;">
                <div class="text-caption text-black">Product Name: {{product.productName}}</div>
                <div class="text-caption text-black">Seller: {{product.displayName}}</div>
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

    <q-dialog v-model="viewMore" transition-show="rotate" transition-hide="rotate">
      <q-card style="width: 90vw;">
        <q-card-section class="row items-center">
          <div class="text-h6">Product Details</div>
          <q-space />
          <q-btn label="Close" icon="close" flat color="brown" dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <pre v-if="productData" v-html="productData.productDetails"></pre>
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
        <q-carousel-slide v-for="(product, index) in productData" :key="index" :name="index">
          <div class="q-mt-xl text-center">
            <q-img style="width: 100%;" :src="product" />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-dialog>

  </q-page>
</template>

<style>
</style>

<script>

import { date } from 'quasar'

export default {
  name: 'PageIndex',
  props: {
    firebase: Object,
    user: Object
  },
  data () {
    return {
      scroll: false,
      date,
      viewImage: false,
      slide: 0,
      viewMore: false,
      search: '',
      productData: null,
      products: []
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.$binding('products', this.firebase.firestore().collection('products').orderBy('createdAt', 'asc').limit(4))
    },
    filteredSearch () {
      if (this.search !== '') {
        this.$binding('products', this.firebase.firestore().collection('products').where('productName', '>=', this.search).where('productName', '<=', this.search + 'z').limit(4))
      } else {
        this.scroll = false
        this.loadData()
      }
    },
    viewImageClick (product) {
      this.productData = product.images
      this.viewImage = true
    },
    viewMoreClick (product) {
      this.productData = product
      this.viewMore = true
    },
    onLoad (index, done) {
      setTimeout(() => {
        if (this.products) {
          if (this.products.length === 0) {
            this.scroll = true
          } else {
            var first = null
            if (this.search === '') {
              first = this.firebase.firestore().collection('products').orderBy('createdAt').limit(this.products.length)
            } else {
              first = this.firebase.firestore().collection('products').where('productName', '>=', this.search).where('productName', '<=', this.search + 'z').limit(this.products.length)
            }
            return first.get().then((documentSnapshots) => {
              var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1]

              if (this.search === '') {
                this.firebase.firestore().collection('products').orderBy('createdAt').startAfter(lastVisible).limit(4).get().then((querySnapshot) => {
                  if (querySnapshot.size === 0) {
                    this.scroll = true
                  }
                  querySnapshot.forEach((doc) => {
                    this.products.push(doc.data())
                    done()
                  })
                })
              } else {
                this.firebase.firestore().collection('products').where('productName', '>=', this.search).where('productName', '<=', this.search + 'z').startAfter(lastVisible).limit(4).get().then((querySnapshot) => {
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
