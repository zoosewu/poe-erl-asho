import { ReactNode } from 'react'

export interface SkillGemInfoRoot {
  lines: SkillGemInfo[]
}
export interface SkillGemInfo {
  id: number
  name: string
  icon: string
  levelRequired: number
  baseType: string
  variant: string
  itemClass: number
  sparkline: SparkLine
  lowConfidenceSparkline: SparkLine
  implicitModifiers: any[]
  explicitModifiers: ExplicitModifier[]
  flavourText: string
  corrupted?: boolean
  gemLevel: number
  gemQuality?: number
  chaosValue: number
  exaltedValue: number
  divineValue: number
  count: number
  detailsId: string
  tradeInfo: any[]
  listingCount: number
}
type Nullable<T> = T | null
export interface SparkLine {
  data: Array<Nullable<number>>
  totalChange: number
}

export interface ExplicitModifier {
  text: string
  optional: boolean
}

// from custom
export interface SkillGem {
  icon: ReactNode | undefined
  vaalIcon: ReactNode | undefined
  name: string
  variant: SkillGemVariant[]
}
export interface SkillGemVariant {
  name: string
  level: number
  quality: number
  corrupted: boolean
  isVaalSkill: boolean
  qualityType: number
  chaosValue: number
  divineValue: number
  totalChange: number
  listingCount: number
}
