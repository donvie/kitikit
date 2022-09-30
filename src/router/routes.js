
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', name: 'Kitikit', component: () => import('pages/Index.vue'), meta: { requiresAuth: true, customer: true } },
      { path: '/browse_owner', name: 'Browse', component: () => import('pages/BrowseOwner.vue'), meta: { requiresAuth: true, owner: true } },
      { path: '/login', name: 'Login', component: () => import('pages/Login.vue') },
      { path: '/message', name: 'Inbox', component: () => import('pages/Message.vue'), meta: { requiresAuth: true } },
      { path: '/account', name: 'Account', component: () => import('pages/Account.vue'), meta: { requiresAuth: true } },
      { path: '/myproduct', name: 'My Product', component: () => import('pages/MyProduct.vue'), meta: { requiresAuth: true, owner: true } }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
