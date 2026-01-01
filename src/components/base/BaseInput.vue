<template>
  <div class="mb-4">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :class="inputClasses"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
  },
  computed: {
    id() {
      return `input-${Math.random().toString(36).substr(2, 9)}`
    },
    inputClasses() {
      const baseClasses = 'w-full px-4 py-3 min-h-[48px] border rounded-lg text-base bg-white transition-colors duration-200 touch-manipulation'
      const stateClasses = this.error
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-primary focus:border-primary'
      const disabledClass = this.disabled ? 'bg-gray-100 cursor-not-allowed' : ''

      return `${baseClasses} ${stateClasses} ${disabledClass}`
    },
  },
  emits: ['update:modelValue', 'blur', 'focus'],
}
</script>
