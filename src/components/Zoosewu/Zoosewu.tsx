import React, { useEffect, useState } from 'react'
import { Currency } from '../../Type/CurrencyInfoType'
import { connect } from 'react-redux'
import { CustomTableFactory, ListedProperty } from '../CustomTable/CustomTable'
import { SkillGem } from '../../Type/SkillGemInfoType'
import { SkillQuality } from '../../Type/SkillQualityType'
import { SetSkillQuality } from '../../redux/actions'
import { CalculatedData } from '../../Type/CalculateType'
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
      ['Name', {
        GetPropertyValue: (data) => (<>{data.icon}{'\n' + data.name + (data.statText === '' ? '' : '\n' + data.statText)}</>),
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
      ['Expenses', {
        GetPropertyValue: (data) => (data.gemExpenses.toFixed(2)),
        GetComparer: (dataA, dataB) => (dataB.gemExpenses - dataA.gemExpenses)
      } as ListedProperty<CalculatedData>],
      ['VaalIncome', {
        GetPropertyValue: (data) => {
          const calculatedType = data.vaal
          let detailInfo = ''
          for (const detail of calculatedType.details) {
            detailInfo += `\n${detail.name}(${detail.level}/${detail.quality}${detail.corrupted ? 'c' : ''}), price:${detail.price.toFixed(2)}, weight:${detail.weight.toFixed(2)}`
          }
          return `expenses:${calculatedType.expenses.toFixed(2)} revenues:${calculatedType.revenues.toFixed(2)} income:${calculatedType.income.toFixed(2)} detail count:${calculatedType.details.length}` + detailInfo
        },
        GetComparer: (dataA, dataB) => (dataB.vaal.income - dataA.vaal.income)
      } as ListedProperty<CalculatedData>],
      ['LensIncome', {
        GetPropertyValue: (data) => {
          const calculatedType = data.lens
          let detailInfo = ''
          for (const detail of calculatedType.details) {
            detailInfo += `\n${detail.name}(${detail.level}/${detail.quality}${detail.corrupted ? 'c' : ''}), price:${detail.price.toFixed(2)}, weight:${detail.weight.toFixed(2)}`
          }
          return `expenses:${calculatedType.expenses.toFixed(2)} revenues:${calculatedType.revenues.toFixed(2)} income:${calculatedType.income.toFixed(2)} detail count:${calculatedType.details.length}` + detailInfo
        },
        GetComparer: (dataA, dataB) => (dataB.lens.income - dataA.lens.income)
      } as ListedProperty<CalculatedData>],
    ]))
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
