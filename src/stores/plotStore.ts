import { defineStore } from 'pinia'
import type { PlotTool } from '@/types/plot'

const MAX_HISTORY = 80

export const usePlotStore = defineStore('plot', {
  state: () => ({
    activeTool: 'none' as PlotTool,
    selectedFeatureId: '',
    undoStack: [] as string[],
    redoStack: [] as string[]
  }),
  getters: {
    canUndo: (state) => state.undoStack.length > 1,
    canRedo: (state) => state.redoStack.length > 0
  },
  actions: {
    setTool(tool: PlotTool) {
      this.activeTool = tool
    },
    setSelectedFeatureId(id: string) {
      this.selectedFeatureId = id
    },
    pushSnapshot(current: string) {
      this.undoStack.push(current)
      this.redoStack = []
      if (this.undoStack.length > MAX_HISTORY) {
        this.undoStack.shift()
      }
    },
    undo(current: string) {
      if (this.undoStack.length < 2) return null
      this.redoStack.push(current)
      this.undoStack.pop()
      return this.undoStack.at(-1) ?? null
    },
    redo(current: string) {
      const next = this.redoStack.pop()
      if (!next) return null
      this.undoStack.push(current)
      return next
    }
  }
})
