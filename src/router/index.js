import Vue from 'vue'
import VueRouter from 'vue-router'
import { firebaseApp } from 'src/firebaseConfig.js'
import { LocalStorage } from 'quasar'
import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!firebaseApp.auth().currentUser) {
        next({
          path: '/login'
        })
      } else if (to.matched.some(record => record.meta.owner)) {
        if (LocalStorage.getItem('switchAccount') === false) {
          next()
        } else {
          next({
            path: '/'
          })
        }
      } else if (to.matched.some(record => record.meta.customer)) {
        if (LocalStorage.getItem('switchAccount') === true) {
          next()
        } else {
          next({
            path: '/browse_owner'
          })
        }
      } else {
        next()
      }
    } else {
      if (firebaseApp.auth().currentUser) {
        if (LocalStorage.getItem('switchAccount') === true) {
          next({
            path: '/browse_owner'
          })
        } else {
          next({
            path: '/'
          })
        }
      } else {
        next()
      }
    }
  })
  return Router
}
