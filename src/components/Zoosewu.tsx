import React, { useEffect, useState } from 'react'
import { Currency } from '../Type/CurrencyInfoType'
import { connect } from 'react-redux'
import { CustomTableFactory, ListedProperty } from './CustomTable'
import { SkillGem } from '../Type/SkillGemInfoType'
import { SkillQuality } from '../Type/SkillQualityType'
import { SetSkillQuality } from '../redux/actions'
import { CalculatedData } from '../Type/CalculateType'
import { ZoosewuCalculate } from './ZoosewuCalculate'
export interface ZoosewuProps {
  currency: Currency[]
  skillGem: Map<string, SkillGem>
  skillQuality: Map<string, SkillQuality>
  SetSkillQuality: typeof SetSkillQuality
}

const Zoosewu: React.FC<ZoosewuProps> = (props) => {
  const { skillGem, SetSkillQuality } = props
  const [stateData, setStateData] = useState<CalculatedData[]>([])
  const Table = CustomTableFactory<CalculatedData>()
  const [listedProperty, SetListedProperty] = useState<Map<string, ListedProperty<CalculatedData>>>()
  useEffect(() => {
    SetListedProperty(new Map<string, ListedProperty<CalculatedData>>([
      ['Icon', {
        GetPropertyValue: (data) => (data.icon),
        GetComparer: (dataA, dataB) => (dataB.name.localeCompare(dataA.name))
      } as ListedProperty<CalculatedData>],
      ['Name', {
        GetPropertyValue: (data) => (data.name),
        GetComparer: (dataA, dataB) => (dataB.name.localeCompare(dataA.name))
      } as ListedProperty<CalculatedData>],
      ['Level', {
        GetPropertyValue: (data) => (data.level),
        GetComparer: (dataA, dataB) => (dataB.level - dataA.level)
      } as ListedProperty<CalculatedData>],
      ['Quality', {
        GetPropertyValue: (data) => (data.quality),
        GetComparer: (dataA, dataB) => (dataB.quality - dataA.quality)
      } as ListedProperty<CalculatedData>],
      ['Cost', {
        GetPropertyValue: (data) => (data.GemCost),
        GetComparer: (dataA, dataB) => (dataB.GemCost - dataA.GemCost)
      } as ListedProperty<CalculatedData>],
      ['Lens Income', {
        GetPropertyValue: (data) => (data.LensIncome),
        GetComparer: (dataA, dataB) => (dataB.LensIncome - dataA.LensIncome)
      } as ListedProperty<CalculatedData>],
      ['Vaal Income', {
        GetPropertyValue: (data) => (data.VaalIncome),
        GetComparer: (dataA, dataB) => (dataB.VaalIncome - dataA.VaalIncome)
      } as ListedProperty<CalculatedData>],
      ['EarningsYield', {
        GetPropertyValue: (data) => (data.earningsYield),
        GetComparer: (dataA, dataB) => (dataB.earningsYield - dataA.earningsYield)
      } as ListedProperty<CalculatedData>],
      ['BaseType', {
        GetPropertyValue: (data) => (data.baseType),
        GetComparer: (dataA, dataB) => (dataB.baseType.localeCompare(dataA.baseType))
      } as ListedProperty<CalculatedData>],
      ['Detail Count', {
        GetPropertyValue: (data) => (data.details.length),
        GetComparer: (dataA, dataB) => (dataB.details.length - dataA.details.length)
      } as ListedProperty<CalculatedData>]]))
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      const newCalculatedData: CalculatedData[] = await ZoosewuCalculate(props)
      setStateData(newCalculatedData)
    }
    fetchData()
  }, [props, skillGem, SetSkillQuality])
  return (
    <>
      <Table data={stateData} listedProperty={listedProperty} />
    </ >
  )
}
const mapStateToProps = (state: { currency: Currency[], skillGem: Map<string, SkillGem>, skillQuality: Map<string, SkillQuality> }) => ({
  currency: state.currency,
  skillGem: state.skillGem,
  skillQuality: state.skillQuality
})
export default connect(mapStateToProps, { SetSkillQuality })(Zoosewu)
