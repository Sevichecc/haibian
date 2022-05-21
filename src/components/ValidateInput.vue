<template>
  <div class="validate-input-container pb-3">
    <input v-if="tag!=='textarea'"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
    >
    <textarea v-else
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      v-model="inputRef.val"
      @blur="validateInput"
      v-bind="$attrs"
    />
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted, computed } from 'vue'
import { emitter } from './ValidateForm.vue'

const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

interface RuleProp {
  type: 'required' | 'email' |'range'|'custom'
  message?: string
  min?:{
    message: string
    length: number
  }
  max?:{
    message: string
    length: number
  }
  validator?: () => boolean
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'

export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  inheritAttrs: false,
  setup (props, context) {
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || '',
        set: val => {
          context.emit('update: modelValue', val)
        }
      }),
      error: false,
      message: ''
    })

    const updateValue = (e: Event) => {
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modelValue', targetValue)
    }

    const clearInputs = () => {
      inputRef.val = ''
    }

    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message ?? ''
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              passed = (emailReg.test(inputRef.val))
              break
            case 'range':
              if (rule.min) {
                passed = (inputRef.val.trim().length >= rule.min.length)
                inputRef.message = rule.min.message
              }
              if (rule.max) {
                passed = (inputRef.val.trim().length <= rule.max.length)
                inputRef.message = rule.max.message
              }
              break
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }

    // 发送事件
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
      emitter.emit('form-item-clear', clearInputs)
    })

    return {
      inputRef,
      updateValue,
      clearInputs,
      validateInput
    }
  }

})
</script>
