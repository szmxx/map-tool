<script setup lang="ts">
import type { PlotTool, ToolOption } from '@/types/plot'

defineProps<{
  activeTool: PlotTool
  tools: ToolOption[]
}>()

const emit = defineEmits<{
  select: [tool: PlotTool]
}>()
</script>

<template>
  <section>
    <h2>标绘工具</h2>
    <div class="tool-grid">
      <button
        v-for="item in tools"
        :key="item.value"
        class="btn"
        :class="{ active: item.value === activeTool }"
        @click="emit('select', item.value)"
      >
        {{ item.label }}
      </button>
    </div>
  </section>
</template>
