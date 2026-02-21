<script setup lang="ts">
import type { FeatureStyle } from '@/types/plot'

const props = defineProps<{
  modelValue: FeatureStyle
}>()

const emit = defineEmits<{
  'update:modelValue': [value: FeatureStyle]
  apply: []
  transform: [type: 'rotate' | 'scale']
}>()

const onFieldChange = (patch: Partial<FeatureStyle>) => {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}
</script>

<template>
  <section>
    <h3>属性调整</h3>
    <label>
      颜色
      <input
        :value="modelValue.color"
        type="color"
        @change="onFieldChange({ color: ($event.target as HTMLInputElement).value }); emit('apply')"
      />
    </label>
    <label>
      大小
      <input
        :value="modelValue.size"
        type="range"
        min="0.4"
        max="5"
        step="0.2"
        @change="onFieldChange({ size: Number(($event.target as HTMLInputElement).value) }); emit('apply')"
      />
    </label>
    <label>
      文字
      <input
        :value="modelValue.label"
        placeholder="输入标注文字"
        @change="onFieldChange({ label: ($event.target as HTMLInputElement).value }); emit('apply')"
      />
    </label>
    <label>
      图标
      <select
        :value="modelValue.icon"
        @change="onFieldChange({ icon: ($event.target as HTMLSelectElement).value as FeatureStyle['icon'] }); emit('apply')"
      >
        <option value="pin">图钉</option>
        <option value="star">星标</option>
        <option value="flag">旗帜</option>
      </select>
    </label>

    <h3>几何编辑</h3>
    <label>
      旋转角度
      <input
        :value="modelValue.rotate"
        type="number"
        @input="onFieldChange({ rotate: Number(($event.target as HTMLInputElement).value) })"
      />
    </label>
    <button class="btn" @click="emit('transform', 'rotate')">应用旋转</button>

    <label>
      缩放倍数
      <input
        :value="modelValue.scale"
        type="number"
        min="0.2"
        step="0.1"
        @input="onFieldChange({ scale: Number(($event.target as HTMLInputElement).value) })"
      />
    </label>
    <button class="btn" @click="emit('transform', 'scale')">应用缩放</button>
  </section>
</template>
