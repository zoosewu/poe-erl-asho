import { SET_SKILL_GEM_DATA, SET_CURRENCY_DATA, SET_CURRENCY_DETAIL_DATA, SET_SKILL_QUALITY_DATA } from './actionTypes'
import { SkillGem } from '../Type/SkillGemInfoType'
import { CurrencyInfo as Currency, CurrencyDetail } from '../Type/CurrencyInfoType'
import { SkillQuality } from '../Type/SkillQualityType'

const initialSkillGemInfoState: Map<string, SkillGem> = new Map<string, SkillGem>()
export const skillGemReducer = (state = initialSkillGemInfoState, action: any): Map<string, SkillGem> => {
  switch (action.type) {
    case SET_SKILL_GEM_DATA:
      return action.payload
    default:
      return state
  }
}

const initialCurrencyState: Currency[] = [] as Currency[]
export const currencyReducer = (state = initialCurrencyState, action: any): Currency[] => {
  switch (action.type) {
    case SET_CURRENCY_DATA:
      return action.payload
    default:
      return state
  }
}

const initialCurrencyDetailState: Map<string, CurrencyDetail> = new Map<string, CurrencyDetail>()
export const currencyDetailReducer = (state = initialCurrencyDetailState, action: any): Map<string, CurrencyDetail> => {
  switch (action.type) {
    case SET_CURRENCY_DETAIL_DATA:
      return action.payload
    default:
      return state
  }
}

const initialSkillQualityState: Map<string, SkillQuality> = new Map<string, SkillQuality>()
export const skillQualityReducer = (state = initialSkillQualityState, action: any): Map<string, SkillQuality> => {
  switch (action.type) {
    case SET_SKILL_QUALITY_DATA:
      return action.payload
    default:
      return state
  }
}
