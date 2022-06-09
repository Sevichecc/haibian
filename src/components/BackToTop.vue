<template>
  <div class="position-sticky bottom-0 end-0 w-100 d-flex justify-content-end b-0 pb-3 pe-5">
    <transition>
      <button class="btn btn-secondary btn-sm"
      v-show="isVisible" @click="scrollToTop"
      aria-label="scroll to top of the page"
      >
        <img src="../assets/to-top.min.svg" alt="a arrow point to top"/>
      </button>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'

export default defineComponent({
  name: 'BackToTop',
  setup() {
    const isVisible = ref(false)
    const handleScroll = () => {
      isVisible.value = window.scrollY > 0
    }
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll)
    })
    return {
      isVisible,
      handleScroll,
      scrollToTop
    }
  }
})
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
