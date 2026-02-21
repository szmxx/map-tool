<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from 'mapbox-gl-draw'
import * as turf from '@turf/turf'

import ToolPanel from '@/components/ToolPanel.vue'
import PropertyEditor from '@/components/PropertyEditor.vue'
import HistoryControls from '@/components/HistoryControls.vue'
import MapCanvas from '@/components/MapCanvas.vue'
import { TOOL_OPTIONS } from '@/constants/tools'
import { usePlotStore } from '@/stores/plotStore'
import type { FeatureStyle, PlotTool } from '@/types/plot'

import 'mapbox-gl/dist/mapbox-gl.css'
import 'mapbox-gl-draw/dist/mapbox-gl-draw.css'

const plotStore = usePlotStore()

const styleState = reactive<FeatureStyle>({
  color: '#ff4d4f',
  size: 1,
  label: '文字标注',
  rotate: 30,
  scale: 1.2,
  icon: 'pin'
})

const statusMessage = ref('就绪')
const mapRef = ref<mapboxgl.Map | null>(null)
const drawRef = ref<MapboxDraw | null>(null)

const canUndo = computed(() => plotStore.canUndo)
const canRedo = computed(() => plotStore.canRedo)

const serialize = () => JSON.stringify(drawRef.value?.getAll() ?? { type: 'FeatureCollection', features: [] })

const commitHistory = () => {
  plotStore.pushSnapshot(serialize())
}

const restoreSnapshot = (snapshot: string) => {
  if (!drawRef.value) return
  drawRef.value.deleteAll()
  const parsed = JSON.parse(snapshot) as GeoJSON.FeatureCollection
  parsed.features.forEach((feature) => drawRef.value?.add(feature as never))
}

const setDrawMode = (tool: PlotTool) => {
  if (!drawRef.value) return
  const modeMap: Record<Exclude<PlotTool, 'none'>, string> = {
    point: 'draw_point',
    line: 'draw_line_string',
    polygon: 'draw_polygon',
    icon: 'draw_point',
    text: 'draw_point',
    arrow: 'draw_line_string',
    battleArrow: 'draw_line_string'
  }

  drawRef.value.changeMode(tool === 'none' ? 'simple_select' : modeMap[tool])
}

const handleToolSelect = (tool: PlotTool) => {
  plotStore.setTool(tool)
  setDrawMode(tool)
  statusMessage.value = `当前工具：${tool}`
}

const handlePropertyApply = () => {
  if (!drawRef.value || !plotStore.selectedFeatureId) return
  const id = plotStore.selectedFeatureId
  drawRef.value.setFeatureProperty(id, 'color', styleState.color)
  drawRef.value.setFeatureProperty(id, 'size', styleState.size)
  drawRef.value.setFeatureProperty(id, 'label', styleState.label)
  drawRef.value.setFeatureProperty(id, 'icon', styleState.icon)
  commitHistory()
}

const transformFeature = (type: 'rotate' | 'scale') => {
  if (!drawRef.value || !plotStore.selectedFeatureId) return
  const target = drawRef.value.get(plotStore.selectedFeatureId) as GeoJSON.Feature | undefined
  if (!target) return

  const center = turf.center(target).geometry.coordinates as [number, number]
  const transformed =
    type === 'rotate'
      ? turf.transformRotate(target, styleState.rotate, { pivot: center })
      : turf.transformScale(target, styleState.scale, { origin: center })

  transformed.id = plotStore.selectedFeatureId
  drawRef.value.add(transformed as never)
  commitHistory()
}

const handleUndo = () => {
  const snapshot = plotStore.undo(serialize())
  if (snapshot) restoreSnapshot(snapshot)
}

const handleRedo = () => {
  const snapshot = plotStore.redo(serialize())
  if (snapshot) restoreSnapshot(snapshot)
}

const onMapReady = (container: HTMLDivElement) => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN ??
    'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejlyd3NnMDAyemYycXA4dm50aHJ5Z3gifQ._A'

  const map = new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [116.4, 39.9],
    zoom: 8
  })

  const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: { trash: true }
  })

  map.addControl(draw)
  map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  mapRef.value = map
  drawRef.value = draw

  map.on('draw.create', (event) => {
    const newFeature = event.features[0] as GeoJSON.Feature
    const id = String(newFeature.id)

    draw.setFeatureProperty(id, 'plotType', plotStore.activeTool)
    draw.setFeatureProperty(id, 'color', styleState.color)
    draw.setFeatureProperty(id, 'size', styleState.size)
    draw.setFeatureProperty(id, 'label', styleState.label)
    draw.setFeatureProperty(id, 'icon', styleState.icon)

    if (plotStore.activeTool === 'arrow' || plotStore.activeTool === 'battleArrow') {
      const width = plotStore.activeTool === 'battleArrow' ? 0.8 : 0.3
      const arrowPolygon = turf.buffer(newFeature as GeoJSON.Feature<GeoJSON.LineString>, width, {
        units: 'kilometers'
      })
      arrowPolygon.id = id
      draw.add(arrowPolygon as never)
      draw.delete(id)
    }

    plotStore.setSelectedFeatureId(id)
    commitHistory()
  })

  map.on('draw.update', () => commitHistory())
  map.on('draw.delete', () => commitHistory())
  map.on('draw.selectionchange', (event) => {
    const selected = event.features[0]
    plotStore.setSelectedFeatureId(selected?.id ? String(selected.id) : '')
  })

  commitHistory()
}
</script>

<template>
  <main class="workspace-layout">
    <aside class="left-panel">
      <ToolPanel :active-tool="plotStore.activeTool" :tools="TOOL_OPTIONS" @select="handleToolSelect" />
      <PropertyEditor v-model="styleState" @apply="handlePropertyApply" @transform="transformFeature" />
      <HistoryControls :can-undo="canUndo" :can-redo="canRedo" @undo="handleUndo" @redo="handleRedo" />
      <p class="status">{{ statusMessage }}</p>
      <small>平移：选中要素后可直接拖动。</small>
    </aside>
    <MapCanvas @ready="onMapReady" />
  </main>
</template>
