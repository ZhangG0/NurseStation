import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },

    //病人端
    {

    },

    //护士端
    {

    },

    //管理端
    {
      path:'/admin/login',
      name:'adminLogin',
      component: () => import('../views/admin/login.vue')
    },
    {
      path:'/admin',
      name:"admin",


    }
  ]
})

export default router
