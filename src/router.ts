import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import store from './store'

const Home = () => import('@/views/Home.vue')
const Login = () => import('@/views/Login.vue')
const ColumnDetail = () => import('@/views/ColumnDetail.vue')
const PostDetail = () => import('@/views/PostDetail.vue')
const CreatePost = () => import('@/views/CreatePost.vue')
const Signup = () => import('@/views/Signup.vue')
const EditProfile = () => import('@/views/EditProfile.vue')
const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        redirectAlreadyLogin: true
      }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostDetail
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: {
        requiredLogin: true
      }
    },
    {
      path: '/signup',
      name: 'sigup',
      component: Signup,
      meta: {
        redirectAlreadyLogin: true
      }
    },
    {
      path: '/edit',
      name: 'edit',
      component: EditProfile,
      meta: {
        requiredLogin: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { user, token } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(e => {

        store.commit('logout')
        next('/login')
      })
    } else {
      if (requiredLogin) {
        next('/login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})
export default router
