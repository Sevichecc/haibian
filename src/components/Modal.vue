<template>
<teleport to="#modal">
  <div class="modal d-block" tabindex="-1" v-if="visible">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{title}}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="onClose">
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="onClose">{{cancelText}}</button>
          <button type="button" class="btn btn-primary" @click="onConfirm">{{confirmText}}</button>
        </div>
      </div>
    </div>
  </div>
</teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'
export default defineComponent({
  name: 'modal',
  props: {
    title: String,
    visible: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },
  emits: ['modal-on-close', 'modal-on-confirm'],
  setup (props, context) {
    useDOMCreate('modal')
    const onClose = () => {
      context.emit('modal-on-close')
    }

    const onConfirm = () => {
      context.emit('modal-on-confirm')
    }

    return {
      onClose,
      onConfirm
    }
  }
})
</script>
