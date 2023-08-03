import { createRouter, createWebHashHistory } from 'vue-router'

import Login from '../views/Login.vue'// 登录页面
import MainBox from '../views/MainBox.vue'// 项目框架页面(主盒子)
import store from '../store/index' // 引入全局store
import RoutesConfig from './config.js'// 引入路由数据

const routes = [
  {// 登录页面路由设置
    path:'/login',
    name:'login',
    component: Login
  },
  {// 项目框架页面(主盒子)路由设置
    path:'/mainbox',
    name:'mainbox',
    component: MainBox,

    // 嵌套路由(根据权限动态添加)
  },
]

const router = createRouter({
  history: createWebHashHistory(),//设置路由模式
  routes
})

// [重点]设置路由守卫,判断用户是否登录,实现登录鉴权
/* 每次路由跳转之前 */
router.beforeEach((to, from, next) => {
  if (to.name === "login") {
    next()
  } else {
    //如果授权(已经登录过了) next()
    //未授权, 重定向到login
    if (!localStorage.getItem("token")) {
      next({
        path: "/login"
      })
    } else {
      // 对vuex中的登录标志为进行判断(第一次登录位false)
      if (!store.state.isGetterRouter) {
        // 删除所有的嵌套路由(直接删除mainbox)
        router.removeRoute('mainbox')// 重新配置mainbox
        ConfigRouter()// 配置动态路由以及设置登录标志位
        next({// 让路由重新走一遍
          path: to.fullPath
        })
      }else{
        next()
      }
    }
  }
})


// [重点]动态添加路由 && 权限控制(路由控制)
const ConfigRouter = () => {
  // 判断当前主路由中是否存在mainbox
  if(!router.hasRoute("mainbox")){
    router.addRoute(  {
      path: "/mainbox",
      name: "mainbox",
      component: MainBox
    })
  }
  /*
    对配置好的路由页面数据(数组)进行循环遍历,动态添加到项目的主盒子下面
  */
  RoutesConfig.forEach(item => {
    checkPermission(item) && router.addRoute("mainbox", item)
  })

  //改变isGetterRouter =  true
  store.commit("changeGetterRouter",true)
}

// 判断当前登录用户的权限来分配路由
const checkPermission = (item)=>{
  if(item.requireAdmin){
    return store.state.userInfo.role===1
  }
  return true
}

export default router
