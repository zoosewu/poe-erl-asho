import { ReactNode } from 'react'

export interface CalculatedData {
  icon: ReactNode
  name: string
  baseType: string
  level: number
  quality: number
  gemCost: number
  lensCost: number
  lensIncome: number
  vaalIncome: number
  doubleVaalIncome: number
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
