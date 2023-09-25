import React, { useEffect, useState } from 'react'
import mockData from '../test/mockDataSkillGem.json'
import { CurrencyInfo, CurrencyDetail } from '../Type/CurrencyInfoType'

import Table from 'react-bootstrap/Table'
import Image from 'react-bootstrap/Image'
import { connect } from 'react-redux'
export interface CurrencyInfoProps {
  currencyInfo: CurrencyInfo
  currencyDetails: Map<string, CurrencyDetail>
}
const CurrencyInfoItem: React.FC<CurrencyInfoProps> = ({ currencyInfo, currencyDetails }) => {
  const detail = currencyDetails.get(currencyInfo.currencyTypeName)
  return (
    <tr>
      <td className='align-middle text-center'><Image src={detail?.icon} width='30px' height='30px' /></td>
      <td className='align-middle' colSpan={2}>{detail?.name}</td>
      <td className='align-middle text-center'>{detail?.id}</td>
      <td className='align-middle text-center'>{currencyInfo.chaosEquivalent}</td>
      <td className='align-middle text-center'>{currencyInfo.receiveSparkLine.totalChange + '%'}</td>
      <td className='align-middle text-center'>{currencyInfo.paySparkLine.totalChange + '%'}</td>
    </tr>
  )
}

const mapStateToProps = (state: { currencyDetails: Map<string, CurrencyDetail> }) => ({
  currencyDetails: state.currencyDetails
})
export default connect(mapStateToProps)(CurrencyInfoItem)
