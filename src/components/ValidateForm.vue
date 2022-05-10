<template>
<form class="validate-form-container">
  <slot></slot>
  <div class="submit-area" @click.prevent="submitForm">
    <slot name="submit">
      <button type="submit" class="btn btn-primary">提交</button>
    </slot>
  </div>
</form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'

type ValidateFunc = () => boolean
type ClearFunc = () => void
type Events = {
  'form-item-created': ValidateFunc
  'form-item-clear': ClearFunc
}
export const emitter = mitt<Events>()

export default defineComponent({
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr: ValidateFunc [] = []
    let clearArr: ClearFunc [] = []

    // 将监听得到的验证函数放到一个数组中
    const validateCallback = (func?: ValidateFunc) => {
      if (func) {
        funcArr.push(func)
      }
    }
    // 用于清空输入框的函数数组
    const clearCallback = (func: ClearFunc) => {
      clearArr.push(func)
    }
    // 循环验证数组内的函数
    const submitForm = () => {
      const result = funcArr.map(func => func()).every(result => result)
      context.emit('form-submit', result)
      clearArr.map(func => func())
    }

    // 添加监听
    emitter.on('form-item-created', validateCallback)
    emitter.on('form-item-clear', clearCallback)

    // 删除监听
    onUnmounted(() => {
      emitter.off('form-item-created', validateCallback)
      emitter.off('form-item-clear', clearCallback)
      funcArr = []
      clearArr = []
    })
    return {
      submitForm
    }
  }
})
</script>
