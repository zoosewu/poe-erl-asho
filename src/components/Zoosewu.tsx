import React, { ReactNode, useEffect, useState } from 'react';
import mockData from '../test/mockDataSkillGem.json'
import CurrencyInfoItem from './CurrencyInfoItem'
import { CurrencyInfoRoot, CurrencyInfo, Currency } from '../Type/CurrencyInfoType'
import PaginationItem from './PaginationItem';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import { useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { CustomTableFactory, ListedProperty } from './CustomTable';
import { SkillGem, SkillGemInfo } from '../Type/SkillGemInfoType';
import { SkillQuality } from '../Type/SkillQualityType';
import { SetSkillQuality } from '../redux/actions';
import { GetSkillQuality } from './SkillQualityGetter';
interface ZoosewuProps {
  currency: Currency[]
  skillGem: Map<string, SkillGem>
  skillQuality: Map<string, SkillQuality>
  SetSkillQuality: typeof SetSkillQuality
}
interface CalculatedData {
  icon: ReactNode
  name: string
  baseType: string
  level: number
  quality: number
  GemCost: number
  LensCost: number
  LensIncome: number
  VaalIncome: number
  earningsYield: number
  details: CalculatedDetail[]
}
interface CalculatedDetail {
  name: string
  qualityType: number
  weight: number
  price: number
}
const Zoosewu: React.FC<ZoosewuProps> = ({ currency, skillGem, skillQuality, SetSkillQuality }) => {
  const [stateData, setStateData] = useState<CalculatedData[]>([])
  const Table = CustomTableFactory<CalculatedData>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listedProperty, SetListedProperty] = useState<Map<string, ListedProperty<CalculatedData>>>()
  useEffect(() => {
    SetListedProperty(new Map<string, ListedProperty<CalculatedData>>([
      ['Icon', {
        GetPropertyValue: (data) => (data.icon),
        GetComparer: (dataA, dataB) => (dataB.name.localeCompare(dataA.name)),
      } as ListedProperty<CalculatedData>],
      ['Name', {
        GetPropertyValue: (data) => (data.name),
        GetComparer: (dataA, dataB) => (dataB.name.localeCompare(dataA.name)),
      } as ListedProperty<CalculatedData>],
      ['Level', {
        GetPropertyValue: (data) => (data.level),
        GetComparer: (dataA, dataB) => (dataB.level - dataA.level),
      } as ListedProperty<CalculatedData>],
      ['Quality', {
        GetPropertyValue: (data) => (data.quality),
        GetComparer: (dataA, dataB) => (dataB.quality - dataA.quality),
      } as ListedProperty<CalculatedData>],
      ['Cost', {
        GetPropertyValue: (data) => (data.GemCost),
        GetComparer: (dataA, dataB) => (dataB.GemCost - dataA.GemCost),
      } as ListedProperty<CalculatedData>],
      ['Lens Income', {
        GetPropertyValue: (data) => (data.LensIncome),
        GetComparer: (dataA, dataB) => (dataB.LensIncome - dataA.LensIncome),
      } as ListedProperty<CalculatedData>],
      ['Vaal Income', {
        GetPropertyValue: (data) => (data.VaalIncome),
        GetComparer: (dataA, dataB) => (dataB.VaalIncome - dataA.VaalIncome),
      } as ListedProperty<CalculatedData>],
      ['EarningsYield', {
        GetPropertyValue: (data) => (data.earningsYield),
        GetComparer: (dataA, dataB) => (dataB.earningsYield - dataA.earningsYield),
      } as ListedProperty<CalculatedData>],
      ['BaseType', {
        GetPropertyValue: (data) => (data.baseType),
        GetComparer: (dataA, dataB) => (dataB.baseType.localeCompare(dataA.baseType)),
      } as ListedProperty<CalculatedData>],
      ['Detail Count', {
        GetPropertyValue: (data) => (data.details.length),
        GetComparer: (dataA, dataB) => (dataB.details.length - dataA.details.length),
      } as ListedProperty<CalculatedData>]]))
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      const newCalculatedData: CalculatedData[] = []
      let primeRegradingLens: number = 0, secondaryRegradingLens: number = 0
      for (const item of currency) {
        if (item.name === 'Prime Regrading Lens') primeRegradingLens = item.chaosEquivalent
        else if (item.name === 'Secondary Regrading Lens') secondaryRegradingLens = item.chaosEquivalent
      }
      const fetchGems: string[] = []
      for (const [key, gem] of skillGem) {
        if (gem.name.includes('Vaal')) continue;
        if (skillQuality.has(gem.name)) continue;
        fetchGems.push(gem.name)
      }
      if (fetchGems.length > 0) {
        const newSkillQualityMap = await GetSkillQuality(fetchGems)
        const newMap = new Map([...skillQuality].concat([...newSkillQualityMap]))
        SetSkillQuality(newMap)
      }
      for (const [key, gem] of skillGem) {
        const qualityInfo = skillQuality.get(gem.name)!
        for (const variant of gem.variant) {
          if (variant.corrupted) continue;
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
            else if (qualityInfo.tags.includes('Support')) calculatedData.LensCost = primeRegradingLens
            else console.log('gem type error', variant.name, qualityInfo.tags)
            const qualityInfos = skillQuality.get(gem.name)!
            const calculatedDetails: CalculatedDetail[] = []
            let totalWeight: number = 0
            for (const qualityDetail of qualityInfos.qualityDetails) {
              if (qualityDetail['qualityType'] === variant.qualityType) continue;
              for (const otherVariant of gem.variant) {
                if (qualityDetail['qualityType'] !== otherVariant.qualityType) continue;
                if (variant.level !== otherVariant.level) continue;
                if (variant.quality !== otherVariant.quality) continue;
                if (otherVariant.corrupted) continue;
                const newCalculateDetail = {
                  name: otherVariant.name,
                  qualityType: qualityDetail['qualityType'],
                  weight: qualityDetail.weight,
                  price: otherVariant.chaosValue
                } as CalculatedDetail
                totalWeight += qualityDetail.weight
                calculatedDetails.push(newCalculateDetail)
                break;
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
            if (otherVariant.qualityType !== variant.qualityType) continue;
            if (!otherVariant.corrupted) continue;
            const newCalculateDetail = {
              name: otherVariant.name,
              qualityType: variant.qualityType,
              weight: 1,
              price: otherVariant.chaosValue
            } as CalculatedDetail
            if (otherVariant.level == 20 && otherVariant.quality == 20) newCalculateDetail.weight = 2
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
        setStateData(newCalculatedData)
      }
    }
    fetchData()
  }, [skillGem, SetSkillQuality])
  return (
    <div>
      <Table data={stateData} listedProperty={listedProperty} />
    </div >
  )
}
const mapStateToProps = (state: { currency: Currency[], skillGem: Map<string, SkillGem>, skillQuality: Map<string, SkillQuality> }) => ({
  currency: state.currency,
  skillGem: state.skillGem,
  skillQuality: state.skillQuality,
})
export default connect(mapStateToProps, { SetSkillQuality })(Zoosewu); 