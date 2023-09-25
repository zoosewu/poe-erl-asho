import { Image } from 'react-bootstrap'
import { Currency, CurrencyDetail, CurrencyInfoRoot } from '../Type/CurrencyInfoType'

export const POENinjaCurrencyAdapter = (root: CurrencyInfoRoot): [Currency[], Map<string, CurrencyDetail>] => {
  const currencyDetail = new Map<string, CurrencyDetail>()
  root.currencyDetails.forEach(detail => currencyDetail.set(detail.name, detail))

  const Currencies: Currency[] = []
  for (const info of root.lines) {
    const detail = currencyDetail.get(info.currencyTypeName)
    Currencies.push({
      icon: (<Image src={detail?.icon} width='30px' height='30px' />),
      name: detail?.name,
      id: detail?.id,
      chaosEquivalent: info.chaosEquivalent,
      receiveChange: info.receiveSparkLine.totalChange,
      payChange: info.paySparkLine.totalChange
    } as Currency)
  }
  return [Currencies, currencyDetail]
}
