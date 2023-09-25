import { ReactNode } from 'react'

export interface CalculatedData {
  icon: ReactNode
  name: string
  baseType: string
  level: number
  quality: number
  GemCost: number
  LensCost: number
  LensIncome: number
  VaalIncome: number
  earningsYield: number
  details: CalculatedDetail[]
}
export interface CalculatedDetail {
  name: string
  level: number
  quality: number
  corrupted: boolean
  qualityType: number
  weight: number
  price: number
}
