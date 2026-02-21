<script setup lang="ts">
import { onMounted, ref } from 'vue'

const emit = defineEmits<{
  ready: [container: HTMLDivElement]
}>()

const containerRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (containerRef.value) {
    emit('ready', containerRef.value)
  }
})
</script>

<template>
  <section ref="containerRef" class="map-canvas" />
</template>
