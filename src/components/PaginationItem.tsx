import React, { useEffect } from 'react';
import Pagination from 'react-bootstrap/Pagination'
import { useSearchParams } from 'react-router-dom';
export interface PaginationProps {
  amount: number;
  visiblePageLength: number | undefined;
}
const PaginationItem: React.FC<PaginationProps> = ({ amount, visiblePageLength }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage: number = parseInt(searchParams.get('page') as string) || 1
  const gotoPage = (newPage: number) => {
    if (newPage < 1) newPage = 1
    else if (newPage > amount) newPage = amount
    searchParams.set('page', newPage.toString())
    setSearchParams(searchParams)
  }
  useEffect(() => {
    if (currentPage > amount) gotoPage(amount)
  }, [])
  if (amount === 1) return <></>

  const len = visiblePageLength || 1
  const pages = []
  let index = currentPage - len
  if (index <= 1) index = 1
  else {
    pages.push(<Pagination.First key={'first'} onClick={() => gotoPage(1)} />)
    pages.push(<Pagination.Prev key={'prev'} onClick={() => gotoPage(currentPage - 1)} />)
    pages.push(<Pagination.Ellipsis key={'prevEllipsis'} onClick={() => gotoPage(currentPage - (len + 1) * 2)} />)
  }
  for (; index <= currentPage + len && index <= amount; index++) {
    if (index !== currentPage)
      pages.push(<Pagination.Item key={index} onClick={((i) => { return () => gotoPage(i) })(index)}> {index}</Pagination.Item >)
    else
      pages.push(< Pagination.Item key={index} active> {index}</Pagination.Item>)
  }
  if (currentPage + len < amount) {
    pages.push(<Pagination.Ellipsis key={'nextEllipsis'} onClick={() => gotoPage(currentPage + (len + 1) * 2)} />)
    pages.push(<Pagination.Next key={'next'} onClick={() => gotoPage(currentPage + 1)} />)
    pages.push(<Pagination.Last key={'last'} onClick={() => gotoPage(amount)} />)
  }


  return (
    <Pagination className="justify-content-md-center" size="sm">
      {pages}
    </Pagination>
  );
};
export default PaginationItem;