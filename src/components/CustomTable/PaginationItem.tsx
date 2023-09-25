import React, { useCallback, useEffect } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import { useSearchParams } from 'react-router-dom'
export interface PaginationProps {
  amount: number
  visiblePageLength: number | undefined
}
const PaginationItem: React.FC<PaginationProps> = ({ amount, visiblePageLength }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage: number = parseInt(searchParams.get('page') as string) || 1

  const GotoPage = useCallback((newPage: number) => {
    if (newPage < 1) newPage = 1
    else if (newPage > amount) newPage = amount
    searchParams.set('page', newPage.toString())
    setSearchParams(searchParams)
  }, [amount, setSearchParams, searchParams])

  useEffect(() => {
    if (currentPage > amount) GotoPage(amount)
  }, [amount, currentPage, GotoPage])
  if (amount === 1) return <></>

  const len = visiblePageLength || 1
  const pages = []
  let index = currentPage - len
  if (index <= 1) index = 1
  else {
    pages.push(<Pagination.First key='first' onClick={() => GotoPage(1)} />)
    pages.push(<Pagination.Prev key='prev' onClick={() => GotoPage(currentPage - 1)} />)
    pages.push(<Pagination.Ellipsis key='prevEllipsis' onClick={() => GotoPage(currentPage - (len + 1) * 2)} />)
  }
  for (; index <= currentPage + len && index <= amount; index++) {
    if (index !== currentPage) { pages.push(<Pagination.Item key={index} onClick={((i) => { return () => GotoPage(i) })(index)}> {index}</Pagination.Item>) } else { pages.push(<Pagination.Item key={index} active> {index}</Pagination.Item>) }
  }
  if (currentPage + len < amount) {
    pages.push(<Pagination.Ellipsis key='nextEllipsis' onClick={() => GotoPage(currentPage + (len + 1) * 2)} />)
    pages.push(<Pagination.Next key='next' onClick={() => GotoPage(currentPage + 1)} />)
    pages.push(<Pagination.Last key='last' onClick={() => GotoPage(amount)} />)
  }

  return (
    <Pagination className='justify-content-md-center' size='sm'>
      {pages}
    </Pagination>
  )
}
export default PaginationItem
