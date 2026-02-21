import { createRouter, createWebHistory } from 'vue-router'
import PlotWorkspaceView from '@/views/PlotWorkspaceView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'plot-workspace',
      component: PlotWorkspaceView
    }
  ]
})
