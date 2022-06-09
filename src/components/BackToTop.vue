<template>
  <button class="btn btn-secondary float-end"
   v-show="isVisible" @click="handleScroll">
    <img src="../assets/to-top.svg"/>
  </button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'BackToTop',
  props: {
    el: {
      type: String,
      default: '#app'
    },
    move: {
      type: Number,
      default: 300
    }
  },
  setup(props) {
    const isVisible = ref(true)
    const display = ref('')
    const timer = ref(0)

    // 控制滚动到顶部
    const scrollToTop = () => {
      const scrollY = document.documentElement.scrollTop
      if (scrollY > 0) {
        document.documentElement.scrollTop = scrollY - props.move
        requestAnimationFrame(scrollToTop) || setTimeout(scrollToTop, 1000 / 60)
      } else {
        cancelAnimationFrame(timer.value) || clearTimeout(timer.value)
      }
    }
    // 控制滚动行为
    const handleScroll = () => {
      clearTimeout(timer.value)
      cancelAnimationFrame(timer.value)
      timer.value = requestAnimationFrame(scrollToTop) || setTimeout(scrollToTop, 1000 / 60)
      scrollToTop()
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })
    return {
      isVisible,
      display,
      handleScroll
    }
  }
})
</script>

<style>
</style>
