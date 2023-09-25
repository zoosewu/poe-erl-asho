import { Form, InputGroup, Table } from 'react-bootstrap'
import PaginationItem from './PaginationItem'
import React, { useCallback, useEffect, useState } from 'react'
import Spinning from './Spinning'
import { useSearchParams } from 'react-router-dom'
export interface ListedProperty<P> {
  propertyName: string
  GetPropertyValue: (data: P) => any
  GetComparer: (dataA: P, dataB: P) => number
}
interface CustomTableProps<P> {
  data: P[] | undefined
  listedProperty?: Map<string, ListedProperty<P>>
}

export const CustomTableFactory = <P extends any>() => {
  const CustomTable: React.FC<CustomTableProps<P>> = ({ data, listedProperty }) => {
    const [sortedData, SetSortedData] = useState<P[]>()
    const [searchedValue, SetSearchedValue] = useState<string>('')
    const [searchedData, SetSearchedData] = useState<P[]>()
    const [searchParams, SetSearchParams] = useSearchParams()
    const sortBy: string = searchParams.get('sortBy') ?? ''
    const currentPage: number = parseInt(searchParams.get('page') as string) ?? 1
    useEffect(() => {
      if (data == null) return
      SetSortedData(data)
    }, [data])
    useEffect(() => {
      if (data == null) return
      if (listedProperty == null) return
      if (listedProperty.has(sortBy)) {
        data.sort(listedProperty.get(sortBy)?.GetComparer)
      } else if (listedProperty.has(sortBy.substring(1))) {
        data.sort((a, b) => (-1 * (listedProperty.get(sortBy.substring(1))!.GetComparer(a, b))))
      }
      SetSortedData(Object.assign([], data))
    }, [listedProperty, sortBy, data])
    useEffect(() => {
      if (searchedValue === '' || (sortedData == null) || (listedProperty == null)) {
        if (sortedData !== undefined && sortedData.length > 0) console.log('searchedValue', sortedData)
        SetSearchedData(sortedData)
        return
      }
      const newSearchedData: P[] = []
      let searchingType = ''
      let searchingValue = searchedValue.toLowerCase()
      if (searchedValue.includes(':')) {
        const searchSplit = searchedValue.split(':')
        searchingType = searchSplit[0].toLowerCase()
        searchingValue = searchSplit.splice(1).join(':').toLowerCase()
      }
      for (const item of sortedData) {
        for (const [key, property] of listedProperty) {
          if (searchingType !== '' && key.toLowerCase() !== searchingType) continue
          if (property.GetPropertyValue(item)?.toString().toLowerCase().includes(searchingValue)) {
            newSearchedData.push(item)
            break
          }
        }
      }
      if (newSearchedData !== undefined && newSearchedData.length > 0) console.log('searchedValue', newSearchedData)
      SetSearchedData(newSearchedData)
    }, [listedProperty, sortedData, searchedValue])

    const sort = useCallback(
      (newSortBy: string) => {
        if (!newSortBy) return
        if (!listedProperty!.has(newSortBy) && !listedProperty!.has(newSortBy.substring(1))) return
        searchParams.set('sortBy', sortBy === newSortBy ? 'r' + newSortBy : newSortBy)
        SetSearchParams(searchParams)
      }, [listedProperty, SetSearchParams, searchParams, sortBy])

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked.toString() : target.value
        SetSearchedValue(value)
        // const name = target.name as any;
        // console.log(event, target, value, name)
      }, [SetSearchedValue])
    const renderCaret = useCallback(
      (name: string) => {
        if (sortBy === name) return <i className='bi bi-caret-down-fill' />
        if (sortBy === 'r' + name) return <i className='bi bi-caret-up-fill' />
        return <i className='bi bi-caret-down' />
      }, [sortBy])
    if (searchedData == null) {
      return (
        <Spinning />
      )
    }
    const listAmount: number = 50
    const pages: number = Math.ceil(searchedData.length / listAmount)
    return (
      <div className='my-5 px-5'>
        <InputGroup className='px-5 my-3'>
          <Form.Control
            placeholder='Name:Anomalous Prismatic Burst Support'
            aria-label='search'
            aria-describedby='search-table'
            onChange={handleChange.bind(this)}
          />
        </InputGroup>
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              {[...listedProperty!.keys()].map((key, index) => (
                <th key={key} onClick={() => sort(key)}>{key}{renderCaret(key)}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[...searchedData].splice((currentPage - 1) * listAmount, listAmount).map((d, index) => (
              <tr key={index}>
                {[...listedProperty!.values()].map((value, i) => (
                  <td key={i} className='align-middle text-center text-pre' >{value.GetPropertyValue(d)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
        <PaginationItem amount={pages} visiblePageLength={4} />
      </div>
    )
  }
  return CustomTable
}
export default CustomTableFactory
