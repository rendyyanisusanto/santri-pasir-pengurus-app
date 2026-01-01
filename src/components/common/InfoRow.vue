<template>
  <div class="flex items-start py-3 border-b border-gray-50 last:border-0">
    <div v-if="$slots.icon" class="flex-shrink-0 mr-4 text-gray-400 mt-0.5">
      <slot name="icon"></slot>
    </div>
    <div class="flex-1">
      <div class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">{{ label }}</div>
      <div class="text-base font-semibold text-gray-900 leading-snug break-words" :class="{'whitespace-pre-line': multiline}">{{ value }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoRow',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: '-'
    },
    multiline: {
      type: Boolean,
      default: false
    }
  }
}
</script>

