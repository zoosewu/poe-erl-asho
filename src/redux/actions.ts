import { SET_SKILL_GEM_DATA, SET_CURRENCY_DATA, SET_CURRENCY_DETAIL_DATA, SET_SKILL_QUALITY_DATA } from './actionTypes';
import { SkillGem } from '../Type/SkillGemInfoType'
import { CurrencyInfo, CurrencyDetail, Currency } from '../Type/CurrencyInfoType';
import { Cargoquery, SkillQuality, SkillQualityInfo, SkillQualityInfoRoot } from '../Type/SkillQualityType';

interface SetSkillGemInfosAction {
  type: typeof SET_SKILL_GEM_DATA;
  payload: Map<string, SkillGem>;
}
export const SetSkillGem = (info: Map<string, SkillGem>): SetSkillGemInfosAction => ({
  type: SET_SKILL_GEM_DATA,
  payload: info,
});

interface SetCurrencyAction {
  type: typeof SET_CURRENCY_DATA;
  payload: Currency[];
}
export const SetCurrency = (info: Currency[]): SetCurrencyAction => ({
  type: SET_CURRENCY_DATA,
  payload: info,
});

interface SetCurrencyDetailsAction {
  type: typeof SET_CURRENCY_DETAIL_DATA;
  payload: Map<string, CurrencyDetail>;
}
export const SetCurrencyDetails = (info: Map<string, CurrencyDetail>): SetCurrencyDetailsAction => ({
  type: SET_CURRENCY_DETAIL_DATA,
  payload: info,
});

interface SetSkillQualityAction {
  type: typeof SET_SKILL_QUALITY_DATA;
  payload: Map<string, SkillQuality>;
}
export const SetSkillQuality = (info: Map<string, SkillQuality>): SetSkillQualityAction => ({
  type: SET_SKILL_QUALITY_DATA,
  payload: info,
});

