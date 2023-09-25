import React, { useEffect, useState } from 'react'
import mockData from '../test/mockDataSkillGem.json'
import { SkillGemInfo } from '../Type/SkillGemInfoType'

import Table from 'react-bootstrap/Table'
import Image from 'react-bootstrap/Image'
export interface SkillGemInfoProps {
  SkillGemInfo: SkillGemInfo
}
const SkillGemInfoItem: React.FC<SkillGemInfoProps> = ({ SkillGemInfo }) => {
  const quality = SkillGemInfo.gemQuality ?? 0
  const corrupted = SkillGemInfo.corrupted ?? false
  return (
    <tr>
      <td className='align-middle text-center'><Image src={SkillGemInfo.icon} width='30px' height='30px' /></td>
      <td className='align-middle' colSpan={2}>{SkillGemInfo.name}</td>
      <td className='align-middle text-center'>{SkillGemInfo.gemLevel}</td>
      <td className='align-middle text-center'>{quality}</td>
      <td className='align-middle text-center'>{corrupted.toString()}</td>
      <td className='align-middle text-center'>{SkillGemInfo.divineValue}</td>
      <td className='align-middle text-center'>{SkillGemInfo.listingCount}</td>
    </tr>
  )
}

export default SkillGemInfoItem
