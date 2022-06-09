<template>
  <div class="column-detail-page w-690">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img v-lazy="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
    <button
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block"
      @click="loadMorePage" v-if="!isLastPage"
    >
      加载更多
    </button>
  </div>
  <back-to-top></back-to-top>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, ColumnProps } from '../store'
import { addColumnAvatar } from '../helper'
import PostList from '../components/PostList.vue'
import useLoadMore from '@/hooks/useLoadMore'
import BackToTop from '@/components/BackToTop.vue'

export default defineComponent({
  components: { PostList, BackToTop },
  setup () {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const currentId = ref(route.params.id)
    onMounted(() => {
      store.dispatch('fetchColumn', currentId.value)
      store.dispatch('fetchPosts', { cid: currentId.value })
    })

    // 检测变化
    watch(() => route.params, (toParams) => {
      const jumpId = toParams && toParams.id
      const column = store.state.user.column
      if (jumpId && column && (jumpId === column)) {
        store.dispatch('fetchColumn', jumpId)
        store.dispatch('fetchPosts', { cid: jumpId })
        currentId.value = toParams.id
      }
    })

    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId.value) as ColumnProps | undefined

      if (selectColumn) {
        addColumnAvatar(selectColumn, 100, 100)
      }
      return selectColumn
    })
    const list = computed(() => store.getters.getPostsByCid(currentId.value))
    const count = computed(() => store.getters.getPostsCountByCid(currentId.value))
    const currentPage = computed(() => store.getters.getPostsCurrentPageByCid(currentId.value))
    const { loadMorePage, isLastPage } = useLoadMore('fetchPosts', count, { currentPage: currentPage.value, cid: currentId.value })
    return {
      column,
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style>
.w-690{
  width: 680px;
  margin: 0 auto;
}
</style>
