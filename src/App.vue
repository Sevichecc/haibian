<template>
  <div class="container-fluid px-0 flex-shrink-0">
    <global-header :user="currentUser"> </global-header>
    <loader v-if="isLoading"></loader>
    <router-view></router-view>
    <footer class="text-center py-4 text-dark bg-light mt-6 ">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2022 海边小站</li>
          <li class="list-inline-item"><a href="https://github.com/Sevichecc/haibian">Github</a></li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import { defineComponent, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './components/Loader.vue'
import { GlobalDataProps } from './store'
import createMessage from './components/createMessage'
export default defineComponent({
  name: 'App',
  components: { GlobalHeader, Loader },
  setup () {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const token = computed(() => store.state.token)
    const error = computed(() => store.state.error)
    onMounted(() => {
      if (!currentUser.value.isLogin && token.value) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
        store.dispatch('fetchCurrentUser')
      }
    })
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error', 2000)
      }
    })
    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>
