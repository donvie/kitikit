import VueFirestore from 'vue-firestore'
import Vue2Filters from 'vue2-filters'

export default async ({ app, router, Vue }) => {
  Vue.use(VueFirestore).use(Vue2Filters)
}
