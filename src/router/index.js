import { createRouter, createWebHistory } from 'vue-router'
import * as layout from '@/layout'
import * as view from "@/views/index.js";

const routes = [
  //默认 重定向至User
  {
    path: '',
    name: 'home',
    redirect:'/user/today'
  },
  //病人端
  {
    component: layout.userLayout,
    children: [
      {
        path: '/user/today',
        name: 'User-Today',
        component: view.UserIndex
      },
      {
        path: '/community',
        name: 'Community',
        component: view.Community
      },
      {
        path: '/personInfo',
        name: 'PersonInfo',
        component: view.PersonInfo
      },
      {
        path: '/myMessage',
        name: 'MyMessage',
        component: view.MyMessage
      }
    ]
  },

  //护士端
  {

  },

  //管理端
  {
    path:'/admin/login',
    name:'adminLogin',
    component: view.AdminLogin
  },
  {
    path:'/adminHome',
    component: layout.adminLayout,
    children:[
      {
        path:'/adminHome',
        name:'/adminHome',
        component: view.AdminHome
      }
    ]
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
