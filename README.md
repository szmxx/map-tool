# Map 标绘工具（组件化架构）

## 技术栈
- Vue 3 + TypeScript
- Vue Router 4
- Pinia
- Mapbox GL + mapbox-gl-draw
- Turf.js

## 工程结构
- `src/views/PlotWorkspaceView.vue`：页面级编排（容器组件）
- `src/components/ToolPanel.vue`：标绘工具面板
- `src/components/PropertyEditor.vue`：属性与变换编辑
- `src/components/HistoryControls.vue`：撤销/重做控制
- `src/components/MapCanvas.vue`：地图挂载容器
- `src/stores/plotStore.ts`：状态与历史管理
- `src/constants/tools.ts`：工具配置
- `src/types/plot.ts`：类型定义

## 运行
```bash
npm install
npm run dev
```

> 可通过 `VITE_MAPBOX_TOKEN` 配置你的 mapbox token。
