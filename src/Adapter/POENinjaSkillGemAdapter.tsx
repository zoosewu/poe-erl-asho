import { Image } from 'react-bootstrap'
import { SkillGem, SkillGemInfoRoot, SkillGemVariant } from '../Type/SkillGemInfoType'

export const POENinjaSkillGemAdapter = (root: SkillGemInfoRoot): Map<string, SkillGem> => {
  const map: Map<string, SkillGem> = new Map<string, SkillGem>()
  for (const info of root.lines) {
    if (info.sparkline.totalChange !== info.lowConfidenceSparkline.totalChange) continue
    if (info.listingCount < 6) continue
    let isVaalSkill = false
    let baseType: string = info.baseType
    const baseTypeSplit = baseType.split(' ')
    if (baseTypeSplit.includes('Vaal')) {
      baseType = baseTypeSplit.splice(baseTypeSplit.indexOf('Vaal') + 1).join(' ')
      isVaalSkill = true
    }
    let skillGem: SkillGem
    if (map.has(baseType)) {
      skillGem = map.get(baseType)!
      if (isVaalSkill && skillGem.vaalIcon === undefined) skillGem.vaalIcon = (<Image src={info?.icon} width='30px' height='30px' />)
      else if (skillGem.icon === undefined) skillGem.icon = (<Image src={info?.icon} width='30px' height='30px' />)
    } else {
      skillGem = {
        icon: undefined,
        vaalIcon: undefined,
        name: baseType,
        variant: []
      } as SkillGem
      if (isVaalSkill) skillGem.vaalIcon = (<Image src={info?.icon} width='30px' height='30px' />)
      else skillGem.icon = (<Image src={info?.icon} width='30px' height='30px' />)
      map.set(baseType, skillGem)
    }
    let qualityType: number
    if (info.name.includes('Anomalous')) qualityType = 2
    else if (info.name.includes('Divergent')) qualityType = 3
    else if (info.name.includes('Phantasmal')) qualityType = 4
    else qualityType = 1
    const variant: SkillGemVariant = {
      name: info.name,
      level: info.gemLevel,
      quality: info.gemQuality || 0,
      corrupted: info.corrupted || false,
      isVaalSkill,
      qualityType,
      chaosValue: info.chaosValue,
      divineValue: info.divineValue,
      totalChange: info.sparkline.totalChange,
      listingCount: info.listingCount
    } as SkillGemVariant
    skillGem.variant.push(variant)
  }
  return map
}
