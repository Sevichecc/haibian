<template>
<nav class="navbar-dark bg-primary justify-content-between mb-4 px-4">
<div class="w-75 mx-auto navbar">
   <router-link class="navbar-brand" to="/">者也专栏</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登陆</router-link></li>
      <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <dropdown :title="`你好，${user.nickName}`">
        <dropdown-item><router-link to="/create" class="dropdown-item">新建文章</router-link></dropdown-item>
        <dropdown-item><router-link :to="`/column/${user.column}`" class="dropdown-item">我的专栏</router-link></dropdown-item>
        <dropdown-item> <router-link to="/edit"  class="dropdown-item">编辑资料</router-link></dropdown-item>
        <dropdown-item> <a href="#" @click="logout" class="dropdown-item">退出登录</a></dropdown-item>
      </dropdown>
    </ul>
  </div>
</nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import store, { UserProps } from '../store'
import createMessage from './createMessage'
export default defineComponent({
  name: 'GlobalHeader',
  components: { Dropdown, DropdownItem },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    const router = useRouter()
    const logout = () => {
      createMessage('退出登录成功，2秒后跳转到首页', 'success', 2000)
      store.commit('logout')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
    return {
      logout
    }
  }
})
</script>
