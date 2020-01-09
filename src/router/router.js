import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import login from '../views/login'
import index from '../components/index'
import learning from '../components/learning'
import mine from "../components/mine"
import previous from '../components/previous'
import scholastic from '../components/scholastic'
import Transcript from '../components/Transcript.vue'
import Student from '../components/Student'
import statement  from '../components/patriarch/statement .vue'
import { nextTick } from 'q';

const router = new Router({
  // mode:'history',
  // base: process.env.BASE_URL,
  routes:[
    {
      path:'/',
      component:login,
      meta: {
        title: '考考教育'
      }
    },{
      path:'/index',
      meta:{
        requrieAuth:true
      },
      component:index,
      children:[
        {
          path:'/learning',
          component:learning,
          meta: {
            title: '考考教育最新学情'
          }
        },
        {
          path:'/mine',
          component:mine,
          meta: {
            title: '考考教育我的管理'
          }
        },
        {
          path:"/previous",
          component:previous,
          meta: {
            title: '考考教育往期学情'
          }
        },
        {
          path:"/scholastic",
          component:scholastic,
          meta: {
            title: '考考教育学生追踪'
          }
        },
        {
          path:"/Transcript",
          component:Transcript,
          meta: {
            title: '考考教育'
          }
        },
        {
          path:"/Student",
          component:Student,
          meta: {
            title: '考考教育'
          }
        }
      ]
    },
    {
      path:'/statement',
      component:statement,
      meta: {
        title: '考考教育'
      }
    }
  ]
}) 

//导航守卫
router.beforeEach((to,from,next) =>{
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
  if(to.matched.some(route => route.meta.requrieAuth)){
      if(sessionStorage.getItem("loged")){
        next()
      }else{
        next('/?returnURL=' +to.path)
      }
      
  }else{
      next()
  }
})



export default router
