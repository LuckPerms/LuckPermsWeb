<template>
  <input
    :id="id"
    :name="name"
    type="date"
    :value="displayValue"
    :min="min"
    :placeholder="placeholder"
    :autofocus="autofocus"
    @input="onInput"
    @change="onChange"
    @blur="onBlur"
  >
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Date, Number, String],
    default: null,
  },
  id: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: null,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  disabledDates: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue', 'closed']);

function toDateInput(value) {
  if (value === null || value === undefined || value === '') return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromDateInput(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

const displayValue = computed(() => toDateInput(props.modelValue));

const min = computed(() => (props.disabledDates.to ? toDateInput(props.disabledDates.to) : undefined));

function onInput(event) {
  emit('update:modelValue', fromDateInput(event.target.value));
}

function onChange(event) {
  emit('update:modelValue', fromDateInput(event.target.value));
  emit('closed');
}

function onBlur() {
  emit('closed');
}
</script>
