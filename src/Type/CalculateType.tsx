import { ReactNode } from 'react'

export interface CalculatedData {
  icon: ReactNode
  name: string
  statText: string
  baseType: string
  level: number
  quality: number
  gemExpenses: number
  lens: CalculateType
  vaal: CalculateType
  doubleCorrupted: CalculateType
}
export interface CalculateType {
  expenses:number
  revenues: number
  income: number
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
