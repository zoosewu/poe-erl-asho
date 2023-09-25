import { CalculatedData, CalculatedDetail } from '../Type/CalculateType'
import { SkillGem, SkillGemVariant } from '../Type/SkillGemInfoType'
import { GetSkillQuality } from './SkillQualityGetter'
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
    if (gem.name.includes('Vaal')) continue
    if (skillQuality.has(gem.name)) continue
    fetchGems.push(gem.name)
  }
  if (fetchGems.length > 0) {
    const newSkillQualityMap = await GetSkillQuality(fetchGems)
    const newMap = new Map([...skillQuality].concat([...newSkillQualityMap]))
    SetSkillQuality(newMap)
  }
  for (const [, gem] of skillGem) {
    const qualityInfo = skillQuality.get(gem.name)!
    for (const variant of gem.variant) {
      if (variant.corrupted) continue
      const calculatedData: CalculatedData = {
        icon: gem.icon,
        name: variant.name,
        baseType: gem.name,
        level: variant.level,
        quality: variant.quality,
        GemCost: variant.chaosValue,
        LensCost: 0,
        LensIncome: 0,
        VaalIncome: 0,
        earningsYield: 0,
        details: []
      }
      newCalculatedData.push(calculatedData)
      if (!variant.name.includes('Awakened') && skillQuality.has(gem.name)) {
        if (qualityInfo.tags.includes('Spell') || qualityInfo.tags.includes('Attack')) calculatedData.LensCost = primeRegradingLens
        else if (qualityInfo.tags.includes('Support')) calculatedData.LensCost = secondaryRegradingLens
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
          calculatedData.LensIncome += detail.price * detail.weight / totalWeight
        }
        calculatedData.details = calculatedData.details.concat(calculatedDetails)
      }
      const calculatedDetails: CalculatedDetail[] = []
      let totalWeight: number = 0
      for (const otherVariant of gem.variant) {
        if (otherVariant.qualityType !== variant.qualityType) continue
        if (!otherVariant.corrupted) continue
        const newCalculateDetail: CalculatedDetail = {
          name: otherVariant.name,
          level: otherVariant.level,
          quality: otherVariant.quality,
          corrupted: otherVariant.corrupted,
          qualityType: variant.qualityType,
          weight: 1,
          price: otherVariant.chaosValue
        } as CalculatedDetail
        if (otherVariant.level === 20 && otherVariant.quality === 20) newCalculateDetail.weight = 2
        calculatedDetails.push(newCalculateDetail)
        totalWeight += newCalculateDetail.weight
      }
      for (const detail of calculatedDetails) {
        calculatedData.VaalIncome += detail.price * detail.weight / totalWeight
      }
      calculatedData.details = calculatedData.details.concat(calculatedDetails)

      const vaalEarn = (calculatedData.VaalIncome - calculatedData.GemCost) / calculatedData.GemCost
      const lensEarn = (calculatedData.LensIncome - calculatedData.GemCost - calculatedData.LensCost) / (calculatedData.GemCost + calculatedData.LensCost)
      calculatedData.earningsYield = vaalEarn > lensEarn ? vaalEarn : lensEarn
    }
  }
  console.log('newCalculatedData', newCalculatedData)
  return newCalculatedData
}
const CalculateVaalOrb = (currentVariant: SkillGemVariant, baseGem: SkillGem, calculatedData: CalculatedData, props: ZoosewuProps) => {
  const calculatedDetails: CalculatedDetail[] = []
  // let GemWeight =
  const totalWeight: number = 8
  if (currentVariant.level === 20 && currentVariant.quality === 20) {

  }
  for (const otherVariant of baseGem.variant) {
    if (otherVariant.qualityType !== currentVariant.qualityType) continue
    if (!otherVariant.corrupted) continue
    const newCalculateDetail: CalculatedDetail = {
      name: otherVariant.name,
      level: otherVariant.level,
      quality: otherVariant.quality,
      corrupted: otherVariant.corrupted,
      qualityType: currentVariant.qualityType,
      weight: 1,
      price: otherVariant.chaosValue
    } as CalculatedDetail
    if (otherVariant.level === 20 && otherVariant.quality === 20) newCalculateDetail.weight = 2
    calculatedDetails.push(newCalculateDetail)
  }
  for (const detail of calculatedDetails) {
    calculatedData.VaalIncome += detail.price * detail.weight / totalWeight
  }
  calculatedData.details = calculatedData.details.concat(calculatedDetails)
}
