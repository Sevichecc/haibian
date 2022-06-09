import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'
import 'easymde/dist/easymde.min.css'
import VueLazyload from 'vue-lazyload'

const app = createApp(App)
axios.defaults.baseURL = 'https://apis.imooc.com/api/'
axios.interceptors.request.use((config) => {
  config.params = { ...config.params, icode: process.env.VUE_APP_ICODE }
  store.commit('setLoading', true)
  store.commit('setError', { status: false, message: '' })
  if (config.data instanceof FormData) {
    config.data.append('icode', process.env.VUE_APP_ICODE)
  } else {
    config.data = { ...config.data, icode: process.env.VUE_APP_ICODE }
  }
  return config
})

axios.interceptors.response.use(
  (config) => {
    store.commit('setLoading', false)
    return config
  },
  (e) => {
    const { error } = e.response.data
    store.commit('setError', { status: true, message: error })
    store.commit('setLoading', false)
    return Promise.reject(e.response.data)
  }
)
app.use(router)
app.use(store)
// 懒加载
app.use(VueLazyload)
app.mount('#app')
