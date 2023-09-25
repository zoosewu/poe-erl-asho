import { Image } from 'react-bootstrap'
import { SkillGem, SkillGemInfoRoot, SkillGemVariant } from '../Type/SkillGemInfoType'

export const POENinjaSkillGemAdapter = (root: SkillGemInfoRoot): Map<string, SkillGem> => {
  const map: Map<string, SkillGem> = new Map<string, SkillGem>()
  for (const info of root.lines) {
    let skillGem: SkillGem
    if (map.has(info.baseType)) {
      skillGem = map.get(info.baseType)!
    } else {
      skillGem = {
        icon: (<Image src={info?.icon} width='30px' height='30px' />),
        name: info.baseType,
        id: info.id,
        variant: []
      } as SkillGem
      map.set(info.baseType, skillGem)
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
