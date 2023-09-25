import { CalculatedData, CalculatedDetail } from '../../Type/CalculateType'
import { SkillGem, SkillGemVariant } from '../../Type/SkillGemInfoType'
import { SkillQuality } from '../../Type/SkillQualityType'
import { GetSkillQuality } from '../SkillQuality/SkillQualityGetter'
import { ZoosewuProps } from './Zoosewu'
const isLevelChangeCorrupted = (variantOriginal: SkillGemVariant, variantTarget: SkillGemVariant): boolean => {
  if (variantTarget.isVaalSkill) return false
  if (variantOriginal.quality !== variantTarget.quality) return false
  if (variantOriginal.level === variantTarget.level + 1) return true
  if (variantOriginal.level === variantTarget.level - 1) return true
  return false
}
const isQualityChangeCorrupted = (variantOriginal: SkillGemVariant, variantTarget: SkillGemVariant): boolean => {
  if (variantTarget.isVaalSkill) return false
  if (variantOriginal.level !== variantTarget.level) return false
  if (variantOriginal.quality === variantTarget.quality + 3) return true
  if (variantTarget.quality === 0) return true
  return false
}
const isSameGemCorrupted = (variantOriginal: SkillGemVariant, variantTarget: SkillGemVariant): boolean => {
  if (variantTarget.isVaalSkill) return false
  if (variantOriginal.level !== variantTarget.level) return false
  if (variantOriginal.quality !== variantTarget.quality) return false
  return true
}
const isToVaalCorrupted = (variantOriginal: SkillGemVariant, variantTarget: SkillGemVariant): boolean => {
  if (!variantTarget.isVaalSkill) return false
  if (variantOriginal.level !== variantTarget.level) return false
  if (variantOriginal.quality !== variantTarget.quality) return false
  return true
}
const CalculateVaalOrb = (currentVariant: SkillGemVariant, baseGem: SkillGem, calculatedData: CalculatedData, props: ZoosewuProps) => {
  const calculatedDetails: CalculatedDetail[] = []
  const totalWeight: number = 8
  for (const targetVariant of baseGem.variant) {
    let variantWeight = 0
    if (!targetVariant.corrupted) continue
    if (isLevelChangeCorrupted(currentVariant, targetVariant)) variantWeight = 1
    else if (isQualityChangeCorrupted(currentVariant, targetVariant)) variantWeight = 1
    else if (isSameGemCorrupted(currentVariant, targetVariant)) variantWeight = 2
    else if (isToVaalCorrupted(currentVariant, targetVariant)) variantWeight = 2
    else continue
    const newCalculateDetail: CalculatedDetail = {
      name: targetVariant.name,
      level: targetVariant.level,
      quality: targetVariant.quality,
      corrupted: targetVariant.corrupted,
      qualityType: currentVariant.qualityType,
      weight: variantWeight,
      price: targetVariant.chaosValue
    }
    calculatedData.vaalIncome += newCalculateDetail.price * newCalculateDetail.weight / totalWeight
    calculatedDetails.push(newCalculateDetail)
  }
  calculatedData.details = calculatedData.details.concat(calculatedDetails)
}
export const ZoosewuCalculate = async (props: ZoosewuProps): Promise<CalculatedData[]> => {
  const { currency, skillGem, skillQuality, SetSkillQuality } = props
  let newMap: Map<string, SkillQuality> = skillQuality
  let isGetSkillQuality = false
  const newCalculatedData: CalculatedData[] = []
  let primeRegradingLens: number = 0; let secondaryRegradingLens: number = 0
  for (const item of currency) {
    if (item.name === 'Prime Regrading Lens') primeRegradingLens = item.chaosEquivalent
    else if (item.name === 'Secondary Regrading Lens') secondaryRegradingLens = item.chaosEquivalent
  }
  const fetchGems: string[] = []
  for (const [, gem] of skillGem) {
    if (skillQuality.has(gem.name)) continue
    fetchGems.push(gem.name)
  }
  if (fetchGems.length > 0) {
    const newSkillQualityMap = await GetSkillQuality(fetchGems)
    if (newSkillQualityMap.size > 0) {
      console.log('fetchGems', fetchGems, newSkillQualityMap)
      newMap = new Map([...skillQuality].concat([...newSkillQualityMap]))
      isGetSkillQuality = true
    }
  }
  for (const [, gem] of skillGem) {
    const qualityInfo = skillQuality.get(gem.name)!
    for (const variant of gem.variant) {
      if (variant.corrupted) continue
      const calculatedData: CalculatedData = {
        icon: variant.isVaalSkill ? gem.vaalIcon : gem.icon,
        name: variant.name,
        baseType: gem.name,
        level: variant.level,
        quality: variant.quality,
        gemCost: variant.chaosValue,
        lensCost: 0,
        lensIncome: 0,
        vaalIncome: 0,
        doubleVaalIncome: 0,
        earningsYield: 0,
        details: []
      }
      newCalculatedData.push(calculatedData)
      if (!variant.name.includes('Awakened') && skillQuality.has(gem.name)) {
        if (!qualityInfo.tags) console.log('qualityInfo.tags error', qualityInfo.name)
        if (qualityInfo.tags.includes('Spell') || qualityInfo.tags.includes('Attack') || qualityInfo.tags.includes('Warcry')) calculatedData.lensCost = primeRegradingLens
        else if (qualityInfo.tags.includes('Support')) calculatedData.lensCost = secondaryRegradingLens
        else console.log('gem type error', variant.name, qualityInfo.tags)
        CalculateLens(variant, gem, calculatedData, props)
      }
      CalculateVaalOrb(variant, gem, calculatedData, props)
      const vaalEarn = (calculatedData.vaalIncome - calculatedData.gemCost) / calculatedData.gemCost
      const lensEarn = (calculatedData.lensIncome - calculatedData.gemCost - calculatedData.lensCost) / (calculatedData.gemCost + calculatedData.lensCost)
      calculatedData.earningsYield = vaalEarn > lensEarn ? vaalEarn : lensEarn
    }
  }
  if (isGetSkillQuality) SetSkillQuality(newMap)
  return newCalculatedData
}

const CalculateLens = (currentVariant: SkillGemVariant, baseGem: SkillGem, calculatedData: CalculatedData, props: ZoosewuProps) => {
  const calculatedDetails: CalculatedDetail[] = []
  const qualityInfos = props.skillQuality.get(baseGem.name)!
  let totalWeight: number = 0
  for (const qualityDetail of qualityInfos.qualityDetails) {
    if (qualityDetail.qualityType === currentVariant.qualityType) continue
    for (const otherVariant of baseGem.variant) {
      if (qualityDetail.qualityType !== otherVariant.qualityType) continue
      if (currentVariant.level !== otherVariant.level) continue
      if (currentVariant.quality !== otherVariant.quality) continue
      if (otherVariant.corrupted) continue
      const newCalculateDetail: CalculatedDetail = {
        name: otherVariant.name,
        level: otherVariant.level,
        quality: otherVariant.quality,
        corrupted: otherVariant.corrupted,
        qualityType: qualityDetail.qualityType,
        weight: qualityDetail.weight,
        price: otherVariant.chaosValue
      }
      totalWeight += qualityDetail.weight
      calculatedDetails.push(newCalculateDetail)
    }
  }
  for (const detail of calculatedDetails) {
    calculatedData.lensIncome += detail.price * detail.weight / totalWeight
  }
  calculatedData.details = calculatedData.details.concat(calculatedDetails)
}
