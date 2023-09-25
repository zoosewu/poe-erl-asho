import { CalculatedData, CalculatedDetail } from '../../Type/CalculateType'
import { SkillGem, SkillGemVariant } from '../../Type/SkillGemInfoType'
import { GetSkillQuality } from '../SkillQuality/SkillQualityGetter'
import { ZoosewuProps } from './Zoosewu'

export const ZoosewuCalculate = async (props: ZoosewuProps): Promise<CalculatedData[]> => {
  const { currency, skillGem, skillQuality, SetSkillQuality } = props
  const newCalculatedData: CalculatedData[] = []
  let primeRegradingLens: number = 0; let secondaryRegradingLens: number = 0
  for (const item of currency) {
    if (item.name === 'Prime Regrading Lens') primeRegradingLens = item.chaosEquivalent
    else if (item.name === 'Secondary Regrading Lens') secondaryRegradingLens = item.chaosEquivalent
  }
  const fetchGems: string[] = []
  for (const [, gem] of skillGem) {
    if (fetchGems.length > 100) break
    if (skillQuality.has(gem.name)) continue
    fetchGems.push(gem.name)
  }
  if (fetchGems.length > 0) {
    const newSkillQualityMap = await GetSkillQuality(fetchGems)
    if (newSkillQualityMap.size > 0) {
      console.log('fetchGems', fetchGems, newSkillQualityMap)
      const newMap = new Map([...skillQuality].concat([...newSkillQualityMap]))
      SetSkillQuality(newMap)
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
        if (qualityInfo.tags.includes('Spell') || qualityInfo.tags.includes('Attack')) calculatedData.lensCost = primeRegradingLens
        else if (qualityInfo.tags.includes('Support')) calculatedData.lensCost = secondaryRegradingLens
        else console.log('gem type error', variant.name, qualityInfo.tags)
        const qualityInfos = skillQuality.get(gem.name)!
        const calculatedDetails: CalculatedDetail[] = []
        let totalWeight: number = 0
        for (const qualityDetail of qualityInfos.qualityDetails) {
          if (qualityDetail.qualityType === variant.qualityType) continue
          for (const otherVariant of gem.variant) {
            if (qualityDetail.qualityType !== otherVariant.qualityType) continue
            if (variant.level !== otherVariant.level) continue
            if (variant.quality !== otherVariant.quality) continue
            if (otherVariant.corrupted) continue
            const newCalculateDetail: CalculatedDetail = {
              name: otherVariant.name,
              level: otherVariant.level,
              quality: otherVariant.quality,
              corrupted: otherVariant.corrupted,
              qualityType: qualityDetail.qualityType,
              weight: qualityDetail.weight,
              price: otherVariant.chaosValue
            } as CalculatedDetail
            totalWeight += qualityDetail.weight
            calculatedDetails.push(newCalculateDetail)
            break
          }
        }
        for (const detail of calculatedDetails) {
          calculatedData.lensIncome += detail.price * detail.weight / totalWeight
        }
        calculatedData.details = calculatedData.details.concat(calculatedDetails)
      }
      CalculateVaalOrb(variant, gem, calculatedData, props)

      const vaalEarn = (calculatedData.vaalIncome - calculatedData.gemCost) / calculatedData.gemCost
      const lensEarn = (calculatedData.lensIncome - calculatedData.gemCost - calculatedData.lensCost) / (calculatedData.gemCost + calculatedData.lensCost)
      calculatedData.earningsYield = vaalEarn > lensEarn ? vaalEarn : lensEarn
    }
  }
  console.log('newCalculatedData', newCalculatedData)
  return newCalculatedData
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
      weight: 1,
      price: targetVariant.chaosValue
    } as CalculatedDetail
    calculatedData.vaalIncome += newCalculateDetail.price * newCalculateDetail.weight / totalWeight
    calculatedDetails.push(newCalculateDetail)
  }
  calculatedData.details = calculatedData.details.concat(calculatedDetails)
}
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
  if (variantTarget.quality == 0) return true
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