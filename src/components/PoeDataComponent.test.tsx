import React from 'react'
import { render, screen } from '@testing-library/react'
import SkillGemInfoList from './SkillGemInfoList'
test('fetch poe ninja', () => {
  render(<SkillGemInfoList />)
  const linkElement = screen.getByText(/Anomalous Item Rarity Support/i)
  expect(linkElement).toBeInTheDocument()
})
