import React from 'react'
import { render, screen } from '@testing-library/react'
import SkillGemList from './SkillGem/SkillGemList'
test('fetch poe ninja', () => {
  render(<SkillGemList />)
  const linkElement = screen.getByText(/Anomalous Item Rarity Support/i)
  expect(linkElement).toBeInTheDocument()
})
