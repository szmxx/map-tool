export type PlotTool =
  | 'none'
  | 'point'
  | 'line'
  | 'polygon'
  | 'icon'
  | 'text'
  | 'arrow'
  | 'battleArrow'

export interface ToolOption {
  label: string
  value: PlotTool
}

export interface FeatureStyle {
  color: string
  size: number
  label: string
  rotate: number
  scale: number
  icon: 'pin' | 'star' | 'flag'
}
