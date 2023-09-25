import { ReactNode } from 'react'
import { SparkLine } from './SkillGemInfoType'
export interface CurrencyInfoRoot {
  lines: CurrencyInfo[]
  currencyDetails: CurrencyDetail[]
}
export interface CurrencyInfo {
  currencyTypeName: string
  pay?: Pay
  receive?: Pay
  paySparkLine: SparkLine
  receiveSparkLine: SparkLine
  chaosEquivalent: number
  lowConfidencePaySparkLine: SparkLine
  lowConfidenceReceiveSparkLine: SparkLine
  detailsId: string
}
export interface Pay {
  id: number
  league_id: number
  pay_currency_id: number
  get_currency_id: number
  sample_time_utc: string
  count: number
  value: number
  data_point_count: number
  includes_secondary: boolean
  listing_count: number
}
export interface CurrencyDetail {
  id: number
  icon?: string
  name: string
  tradeId?: string
}

// from custom
export interface Currency {
  icon: string | ReactNode
  name: string
  id: number
  chaosEquivalent: number
  receiveChange: number
  payChange: number
}
