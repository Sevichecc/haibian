<template>
  <div class="home-page container-md">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <router-link to="/create" class="btn btn-primary my-2">开始写文章</router-link>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list"></column-list>
    <button
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block"
       @click="loadMorePage" v-if="!isLastPage"
    >
      加载更多
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps, ResponseType, ImageProps } from '../store'
import ColumnList from '../components/ColumnList.vue'
import createMessage from '../components/createMessage'
import useLoadMore from '@/hooks/useLoadMore'
import { objToArr } from '@/helper'

export default defineComponent({
  name: 'Home',
  components: { ColumnList },
  setup () {
    const store = useStore<GlobalDataProps>()
    const totalColumns = computed(() =>
      store.state.columns.total || 0
    )
    const currentPage = computed(() =>
      store.state.columns.currentPage || 0
    )
    onMounted(() => {
      store.dispatch('fetchColumns')
    })

    const list = computed(() => objToArr(store.state.columns.data))
    const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', totalColumns, { currentPage: currentPage.value }, 6)
    const beforeUpload = (file: File) => {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        createMessage('上传图片只能是 JPG 格式!', 'error')
      }
      return isJPG
    }
    const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
      createMessage(`上传图片ID ${rawData.data._id}`, 'success', 2000)
    }
    const afterFileDeleted = () => {
      createMessage('图片已清空', 'default', 2000)
    }
    return {
      list,
      beforeUpload,
      onFileUploaded,
      afterFileDeleted,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
