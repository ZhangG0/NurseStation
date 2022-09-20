import { createRouter, createWebHistory } from 'vue-router'
import adminLayout from "../layout/adminLayout.vue";

const routes = [
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
    path:'/adminHome',
    component: adminLayout,
    children:[
      {
        path:'/adminHome',
        name:'/adminHome',
        component: () => import('../views/admin/Home.vue')
      }
    ]
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
