import { createRouter, createWebHistory } from 'vue-router'
import * as layout from '@/layout'
import * as view from "@/views/index.js";
import {useUserStore} from "@/stores/userStore.js";

const routes = [
  //默认 重定向至User
  {
    path: '',
    name: 'home',
    redirect:'/community'
  },
  //公共端 含返回layout
  {
    component: layout.backLayout,
    children: [
      {
        path:'/user/login',
        name:'User-Login',
        component: view.UserLogin
      }
    ]

  },
  //病人端
  {
    component: layout.userLayout,
    children: [
      {
        path: '/user/today',
        name: 'User-Today',
        component: view.UserIndex,
        meta:{
          Authentication:true
        }
      },
      {
        path: '/community',
        name: 'Community',
        component: view.Community
      },
      {
        path: '/personInfo',
        name: 'PersonInfo',
        component: view.PersonInfo,
        meta:{
          Authentication:true
        }
      },
      {
        path: '/myMessage',
        name: 'MyMessage',
        component: view.MyMessage,
        meta:{
          Authentication:true
        }
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
        name:'adminHome',
        component: view.AdminHome
      }
    ]
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  //路由守卫，访问权限配置
  const userStore = useUserStore();
  if (to.meta.Authentication) { //需要登录才能进入
    if (localStorage.getItem("NurseToken") && userStore.userData.userId !== -1) {
      /** 判断是否为歌手*/
      if (to.meta.SingerOnly) {
        if (userStore.userData.role !== 0) {
          next()
        } else {
          alert("无访问权限!身份认证异常");
          next('/singHome')
        }

      } else {
        next()
      }
    } else {
      alert("无访问权限,请登录");
      next('/user/login')
    }
  } else {
    next()
  }
})


export default router
