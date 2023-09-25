import React, { useEffect, useState } from 'react'
import { SetCurrency } from '../../redux/actions'
import { connect } from 'react-redux'
import CustomTableFactory, { ListedProperty } from '../CustomTable/CustomTable'
import { SkillQuality } from '../../Type/SkillQualityType'
interface SkillQualityListProps {
  skillQuality: Map<string, SkillQuality>
}
const SkillQualityList: React.FC<SkillQualityListProps> = ({ skillQuality }) => {
  const Table = CustomTableFactory<SkillQuality>()
  const [listedProperty, SetListedProperty] = useState<Map<string, ListedProperty<SkillQuality>>>()
  useEffect(() => {
    const GetQualityTypeWeight = (data: SkillQuality, type: number): number => {
      for (const item of data.qualityDetails) {
        if (item.qualityType === type) return item.weight
      }
      return 0
    }
    SetListedProperty(new Map<string, ListedProperty<SkillQuality>>([
      ['Name', {
        GetPropertyValue: (data) => (data.name),
        GetComparer: (dataA, dataB) => (dataB.name.localeCompare(dataA.name))
      } as ListedProperty<SkillQuality>],
      ['Tags', {
        GetPropertyValue: (data) => (data.tags),
        GetComparer: (dataA, dataB) => (dataB.name.localeCompare(dataA.name))
      } as ListedProperty<SkillQuality>],
      ['Type1 Weight', {
        GetPropertyValue: (data) => (GetQualityTypeWeight(data, 1)),
        GetComparer: function (dataA, dataB) { return this.GetPropertyValue(dataB) - this.GetPropertyValue(dataA) }
      } as ListedProperty<SkillQuality>],
      ['Type2 Weight', {
        GetPropertyValue: (data) => (GetQualityTypeWeight(data, 2)),
        GetComparer: function (dataA, dataB) { return this.GetPropertyValue(dataB) - this.GetPropertyValue(dataA) }
      } as ListedProperty<SkillQuality>],
      ['Type3 Weight', {
        GetPropertyValue: (data) => (GetQualityTypeWeight(data, 3)),
        GetComparer: function (dataA, dataB) { return this.GetPropertyValue(dataB) - this.GetPropertyValue(dataA) }
      } as ListedProperty<SkillQuality>],
      ['Type4 Weight', {
        GetPropertyValue: (data) => (GetQualityTypeWeight(data, 4)),
        GetComparer: function (dataA, dataB) { return this.GetPropertyValue(dataB) - this.GetPropertyValue(dataA) }
      } as ListedProperty<SkillQuality>]
    ]))
  }, [skillQuality])
  return (
    <>
      <Table data={[...skillQuality.values()]} listedProperty={listedProperty} />
    </ >
  )
}
const mapStateToProps = (state: { skillQuality: Map<string, SkillQuality> }) => ({
  skillQuality: state.skillQuality
})
export default connect(mapStateToProps, { SetCurrency })(SkillQualityList)
