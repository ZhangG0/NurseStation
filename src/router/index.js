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
      },
      {
        path: '/articleDetail',
        name: 'ArticleDetail',
        component: view.ArticleDetail,
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
    path:'/admin',
    component: layout.adminLayout,
    name:'admin',
    redirect: '/adminHome',
    meta:{
      Authentication:true,
      AdminOnly:true,
    },
    children:[
      {
        path:'/adminHome',
        name:'adminHome',
        component: view.AdminHome,
      },
      {
        path:'/admin/UserManagement',
        name:'UserManagement',
        component: view.UserManagement,
      },
      {
        path:'/admin/NurseManagement',
        name:'NurseManagement',
        component: view.NurseManagement,
      },
      // {
      //   path:'/admin/nurse',
      //   name:'UserManagement',
      //   component: view.UserManagement,
      // }
    ]
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  //路由守卫，访问权限配置
  const userData = useUserStore().userData;
  if (to.meta.Authentication) { //需要登录才能进入
        //确认存在token,且存在用户或护士的code
    if (localStorage.getItem("NurseToken") && (userData.userId !== -1 || userData.nurseCode || userData.role === 100)) {
      /** 判断是否为护士*/
      if (to.meta.NurseOnly) {
        alert("NurseOnly");
      } else if (to.meta.AdminOnly && userData.role === 100){
        alert("AdminOnly");
        next()

      }else {
        next()
      }
    } else if (to.name.includes("admin")) {
      next('/admin/login')
    }else {
      alert("无访问权限,请登录");
      next('/user/login')
    }
  } else {
    next()
  }
})


export default router
