import React, { useEffect, useState } from 'react'
import { SkillGem, SkillGemVariant } from '../Type/SkillGemInfoType'
import { connect } from 'react-redux'
import CustomTableFactory, { ListedProperty } from './CustomTable'
interface SkillGemInfoListProps {
  skillGem: Map<string, SkillGem>
}
interface SkillGemVariantInfo extends SkillGemVariant {
  base: SkillGem
}
const SkillGemInfoList: React.FC<SkillGemInfoListProps> = ({ skillGem }) => {
  console.log('SkillGemInfoList Table')
  const Table = CustomTableFactory<SkillGemVariantInfo>()
  const [listedProperty, SetListedProperty] = useState<Map<string, ListedProperty<SkillGemVariantInfo>>>()
  const [skillGemVariantInfo, SetSkillGemVariantInfo] = useState<SkillGemVariantInfo[]>()
  useEffect(() => {
    SetListedProperty(new Map<string, ListedProperty<SkillGemVariantInfo>>([
      ['Icon', {
        GetPropertyValue: (data) => (data.base.icon),
        GetComparer: (dataA, dataB) => (dataB.base.id - dataA.base.id)
      } as ListedProperty<SkillGemVariantInfo>],
      ['Name', {
        GetPropertyValue: (data) => (data.name),
        GetComparer: (dataA, dataB) => (dataB.name.localeCompare(dataA.name))
      } as ListedProperty<SkillGemVariantInfo>],
      ['ID', {
        GetPropertyValue: (data) => (data.base.id),
        GetComparer: (dataA, dataB) => (dataB.base.id - dataA.base.id)
      } as ListedProperty<SkillGemVariantInfo>],
      ['Level', {
        GetPropertyValue: (data) => (data.level),
        GetComparer: (dataA, dataB) => (dataB.level - dataA.level)
      } as ListedProperty<SkillGemVariantInfo>],
      ['Corrupted', {
        GetPropertyValue: (data) => (data.corrupted.toString()),
        GetComparer: (dataA, dataB) => (Number(dataB.corrupted) - Number(dataA.corrupted))
      } as ListedProperty<SkillGemVariantInfo>],
      ['Quality', {
        GetPropertyValue: (data) => (data.quality),
        GetComparer: (dataA, dataB) => (dataB.quality - dataA.quality)
      } as ListedProperty<SkillGemVariantInfo>],
      ['Quality Type', {
        GetPropertyValue: (data) => (data.qualityType),
        GetComparer: (dataA, dataB) => (dataB.qualityType - dataA.qualityType)
      } as ListedProperty<SkillGemVariantInfo>],
      ['Quality Type Count', {
        GetPropertyValue: (data) => (data.base.variant.length),
        GetComparer: (dataA, dataB) => (dataB.base.variant.length - dataA.base.variant.length)
      } as ListedProperty<SkillGemVariantInfo>],
      ['Chaos', {
        GetPropertyValue: (data) => (data.chaosValue),
        GetComparer: (dataA, dataB) => (dataB.chaosValue - dataA.chaosValue)
      } as ListedProperty<SkillGemVariantInfo>],
      ['Divine', {
        GetPropertyValue: (data) => (data.divineValue),
        GetComparer: (dataA, dataB) => (dataB.divineValue - dataA.divineValue)
      } as ListedProperty<SkillGemVariantInfo>],
      ['price(7day)', {
        GetPropertyValue: (data) => (data.totalChange),
        GetComparer: (dataA, dataB) => (dataB.totalChange - dataA.totalChange)
      } as ListedProperty<SkillGemVariantInfo>],
      ['Listing Count', {
        GetPropertyValue: (data) => (data.listingCount),
        GetComparer: (dataA, dataB) => (dataB.listingCount - dataA.listingCount)
      } as ListedProperty<SkillGemVariantInfo>]
    ]))
  }, [])
  useEffect(() => {
    const skillGemVariantInfo: SkillGemVariantInfo[] = []
    for (const [, gem] of skillGem) {
      for (const item of gem.variant) {
        skillGemVariantInfo.push({
          ...item,
          base: gem
        })
      }
    }
    SetSkillGemVariantInfo(skillGemVariantInfo)
  }, [skillGem])

  return (
    <>
      <Table data={skillGemVariantInfo} listedProperty={listedProperty} />
    </ >
  )
}
const mapStateToProps = (state: { skillGem: Map<string, SkillGem> }) => ({
  skillGem: state.skillGem
})
export default connect(mapStateToProps)(SkillGemInfoList)
