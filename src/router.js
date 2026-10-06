import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: () => import('./views/Dashboard.vue') },
    { path: '/libros', component: () => import('./views/Books.vue') },
    { path: '/libros/:id', component: () => import('./views/BookDetail.vue'), props: true },
    { path: '/usuarios', component: () => import('./views/Users.vue') },
    { path: '/prestamos', component: () => import('./views/Loans.vue') },
    { path: '/:rest(.*)*', redirect: '/' }
  ]
})
