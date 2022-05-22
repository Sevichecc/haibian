<template>
  <div class="vue-easymde-editor">
    <textarea ref="textArea"></textarea>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import EasyMDE, { Options } from 'easymde'
// 定义类型、属性以及事件
interface EditorProps {
  modelValue?: string;
  options?: Options;
}

interface EditorEvents {
    (type:'update:modelValue', value: string) : void;
    (type: 'change', value: string) : void;
    (type: 'blur'): void;
}

const props = defineProps<EditorProps>()
const emit = defineEmits<EditorEvents>()

// 初始化数据
// 1.暴露对应的方法
// 2.结合页面实现验证功能
const textArea = ref<null | HTMLTextAreaElement>(null)
let easyMDEInstance: EasyMDE | null = null
const innerValue = ref(props.modelValue || '')

watch(() => props.modelValue, (newValue) => {
  if (easyMDEInstance) {
    if (newValue !== innerValue.value) {
      easyMDEInstance.value(newValue || '')
    }
  }
})
onMounted(() => {
  if (textArea.value) {
    // 组装 Options
    const config: Options = {
      ...(props.options || {}),
      element: textArea.value,
      initialValue: innerValue.value
    }
    easyMDEInstance = new EasyMDE(config)
    // 监控事件
    easyMDEInstance.codemirror.on('change', () => {
      if (easyMDEInstance) {
        const updatedValue = easyMDEInstance.value()
        innerValue.value = updatedValue
        emit('update:modelValue', updatedValue)
        emit('change', updatedValue)
      }
    })

    easyMDEInstance.codemirror.on('blur', () => {
      if (easyMDEInstance) {
        emit('blur')
      }
    })
  }
})

// 销毁对应的示例
onUnmounted(() => {
  if (easyMDEInstance) {
    easyMDEInstance.cleanup()
  }
  easyMDEInstance = null
})

// 暴露事件
const clear = () => {
  if (easyMDEInstance) {
    easyMDEInstance.value('')
  }
}

const getMDEInstance = () => {
  return easyMDEInstance
}

defineExpose({
  clear,
  getMDEInstance
})
</script>

<style>
.vue-easymde-editor.is-invalid {
  border: 1px solid #dc3545;
}
</style>
