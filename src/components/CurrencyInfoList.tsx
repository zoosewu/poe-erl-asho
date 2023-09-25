import React, { useEffect, useState } from 'react'
import { Currency, CurrencyDetail } from '../Type/CurrencyInfoType'
import { SetCurrency } from '../redux/actions'
import { connect } from 'react-redux'
import CustomTableFactory, { ListedProperty } from './CustomTable'
interface CurrencyListProps {
  currency: Currency[]
  currencyDetails: Map<string, CurrencyDetail>
  SetCurrency: typeof SetCurrency
}
const CurrencyList: React.FC<CurrencyListProps> = ({ currency, currencyDetails, SetCurrency }) => {
  const Table = CustomTableFactory<Currency>()
  const [listedProperty, SetListedProperty] = useState<Map<string, ListedProperty<Currency>>>()
  useEffect(() => {
    SetListedProperty(new Map<string, ListedProperty<Currency>>([
      ['Icon', {
        GetPropertyValue: (data) => (data.icon),
        GetComparer: (dataA, dataB) => (dataB.id - dataA.id)
      } as ListedProperty<Currency>],
      ['Name', {
        GetPropertyValue: (data) => (data.name),
        GetComparer: (dataA, dataB) => (dataB.name.localeCompare(dataA.name))
      } as ListedProperty<Currency>],
      ['ID', {
        GetPropertyValue: (data) => (data.id),
        GetComparer: (dataA, dataB) => (dataB.id - dataA.id)
      } as ListedProperty<Currency>],
      ['Chaos', {
        GetPropertyValue: (data) => (data.chaosEquivalent),
        GetComparer: (dataA, dataB) => (dataB.chaosEquivalent - dataA.chaosEquivalent)
      } as ListedProperty<Currency>],
      ['Buy price(7day)', {
        GetPropertyValue: (data) => (data.receiveChange),
        GetComparer: (dataA, dataB) => (dataB.receiveChange - dataA.receiveChange)
      } as ListedProperty<Currency>],
      ['Sell price(7day)', {
        GetPropertyValue: (data) => (data.payChange),
        GetComparer: (dataA, dataB) => (dataB.payChange - dataA.payChange)
      } as ListedProperty<Currency>]
    ]))
  }, [currency, currencyDetails])
  return (
    <>
      <Table data={currency} listedProperty={listedProperty} />
    </ >
  )
}
const mapStateToProps = (state: { currency: Currency[], currencyDetails: Map<string, CurrencyDetail> }) => ({
  currency: state.currency,
  currencyDetails: state.currencyDetails
})
export default connect(mapStateToProps, { SetCurrency })(CurrencyList)
