import { CalculateType, CalculatedData, CalculatedDetail } from '../../Type/CalculateType'
import { SkillGem, SkillGemVariant } from '../../Type/SkillGemInfoType'
import { SkillQuality, SkillQualityDetail } from '../../Type/SkillQualityType'
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
const CalculateVaalOrb = (currentVariant: SkillGemVariant, baseGem: SkillGem, calculatedData: CalculatedData) => {
  const data: CalculateType = calculatedData.vaal
  const totalWeight: number = 8
  for (const targetVariant of baseGem.variant) {
    let variantWeight = 0
    if (!targetVariant.corrupted) continue
    if (currentVariant.qualityType !== targetVariant.qualityType) continue
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
    data.revenues += newCalculateDetail.price * newCalculateDetail.weight / totalWeight
    data.details.push(newCalculateDetail)
  }
  const totalExpenses = data.expenses + calculatedData.gemExpenses
  data.income = (data.revenues - totalExpenses) / totalExpenses
}
const GetTargetQualityTypeGem = (details: CalculatedDetail[], qualityType: number): CalculatedDetail | null => {
  let targetGem: CalculatedDetail = {
    name: '',
    level: 0,
    quality: 0,
    corrupted: false,
    qualityType: qualityType,
    weight: 0,
    price: 0
  }
  for (const detail of details) {
    if (detail.qualityType === qualityType && detail.price > targetGem.price) targetGem = detail
  }
  if (targetGem.name !== '') return targetGem
  return null
}
const CalculateLens = (currentVariant: SkillGemVariant, baseGem: SkillGem, calculatedData: CalculatedData, props: ZoosewuProps) => {
  const data: CalculateType = calculatedData.lens
  const qualityInfo = props.skillQuality.get(baseGem.name)!
  let totalWeight: number = 0
  for (const info of qualityInfo.qualityDetails) {
    totalWeight += info.weight
  }
  for (const qualityDetail of qualityInfo.qualityDetails) {
    if (qualityDetail.qualityType === currentVariant.qualityType) continue
    for (const otherVariant of baseGem.variant) {
      if (qualityDetail.qualityType !== otherVariant.qualityType) continue
      if (otherVariant.isVaalSkill) continue
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
      data.details.push(newCalculateDetail)
    }
  }
  for (let index = 1; index < 5; index++) {
    const targetGem = GetTargetQualityTypeGem(data.details, index)
    if (targetGem !== null) data.revenues += targetGem.price * targetGem.weight / totalWeight
  }
  const totalExpenses = data.expenses + calculatedData.gemExpenses
  data.income = (data.revenues - totalExpenses) / totalExpenses
}
export const ZoosewuCalculate = (props: ZoosewuProps): CalculatedData[] => {
  const { currency, skillGem, skillQuality } = props
  const newCalculatedData: CalculatedData[] = []
  let primeRegradingLens: number = 0; let secondaryRegradingLens: number = 0
  for (const item of currency) {
    if (item.name === 'Prime Regrading Lens') primeRegradingLens = item.chaosEquivalent
    else if (item.name === 'Secondary Regrading Lens') secondaryRegradingLens = item.chaosEquivalent
  }
  console.log('primeRegradingLens', primeRegradingLens, 'secondaryRegradingLens', secondaryRegradingLens)

  for (const [, gem] of skillGem) {
    const qualityInfo = skillQuality.get(gem.name)!
    for (const variant of gem.variant) {
      if (variant.corrupted) continue
      let qualityType: SkillQualityDetail | undefined = undefined
      if (!qualityInfo) console.log('qualityInfo.tags error', gem.name, qualityInfo)
      else {
        for (const detail of qualityInfo.qualityDetails) {
          if (detail.qualityType === variant.qualityType) {
            qualityType = detail
            break
          }
        }
      }
      const calculatedData: CalculatedData = {
        icon: variant.isVaalSkill ? gem.vaalIcon : gem.icon,
        name: variant.name,
        statText: qualityType ? qualityType.statText : '',
        baseType: gem.name,
        level: variant.level,
        quality: variant.quality,
        gemExpenses: variant.chaosValue,
        lens: { expenses: 0, revenues: 0, income: 0, details: [] } as CalculateType,
        vaal: { expenses: 0, revenues: 0, income: 0, details: [] } as CalculateType,
        doubleCorrupted: { expenses: 0, revenues: 0, income: 0, details: [] } as CalculateType
      }
      newCalculatedData.push(calculatedData)
      if (!variant.name.includes('Awakened') && skillQuality.has(gem.name)) {
        if (!qualityInfo.tags) console.log('qualityInfo.tags error', gem.name, qualityInfo)
        if (qualityInfo.tags.includes('Support')) calculatedData.lens.expenses = secondaryRegradingLens
        else if (qualityInfo.tags.includes('Spell') || qualityInfo.tags.includes('Attack') || qualityInfo.tags.includes('Warcry')) calculatedData.lens.expenses = primeRegradingLens
        else console.log('gem type error', variant.name, qualityInfo.tags)
        CalculateLens(variant, gem, calculatedData, props)
      }
      CalculateVaalOrb(variant, gem, calculatedData)
    }
  }
  return newCalculatedData
}


