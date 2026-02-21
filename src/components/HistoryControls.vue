<script setup lang="ts">
defineProps<{
  canUndo: boolean
  canRedo: boolean
}>()

const emit = defineEmits<{
  undo: []
  redo: []
}>()
</script>

<template>
  <section>
    <h3>历史</h3>
    <div class="history-actions">
      <button class="btn" :disabled="!canUndo" @click="emit('undo')">撤销</button>
      <button class="btn" :disabled="!canRedo" @click="emit('redo')">重做</button>
    </div>
  </section>
</template>
