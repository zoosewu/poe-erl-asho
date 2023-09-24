import { Table } from "react-bootstrap";
import PaginationItem from "./PaginationItem";
import React, { ReactNode, useEffect, useState } from "react";
import Spinning from "./Spinning";
import { useSearchParams } from "react-router-dom";
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
    const [stateData, setStateData] = useState<P[]>()
    const [searchParams, setSearchParams] = useSearchParams();
    const sortBy: string = searchParams.get('sortBy') || ''
    const currentPage: number = parseInt(searchParams.get('page') as string) || 1
    useEffect(() => {
      if (!data) return;
      setStateData(data)
    }, [data]);
    useEffect(() => {
      if (!stateData) return;
      if (listedProperty!.has(sortBy))
        stateData.sort(listedProperty!.get(sortBy)?.GetComparer)
      else if (listedProperty!.has(sortBy.substring(1))) {
        stateData.sort((a, b) => (-1 * (listedProperty!.get(sortBy.substring(1))!.GetComparer(a, b))))
      }
      setStateData(Object.assign([], stateData))
    }, [sortBy, data]);

    const sort = (newSortBy: string) => {
      if (!newSortBy) return;
      if (!listedProperty!.has(newSortBy) && !listedProperty!.has(newSortBy.substring(1))) return;
      searchParams.set('sortBy', sortBy === newSortBy ? 'r' + newSortBy : newSortBy)
      setSearchParams(searchParams)
    }
    if (!stateData) {
      return (
        <Spinning />
      );
    }
    const renderCaret = (name: string) => {
      if (sortBy === name) return <i className="bi bi-caret-down-fill" />
      if (sortBy === 'r' + name) return <i className="bi bi-caret-up-fill" />
      return <i className="bi bi-caret-down" />
    }
    const listAmount: number = 50
    const pages: number = Math.ceil(stateData.length / listAmount)
    return (
      <>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              {[...listedProperty!.keys()].map((key, index) => (
                <th key={key} colSpan={index == 1 ? 2 : 1} onClick={() => sort(key)}>{key}{renderCaret(key)}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[...stateData].splice((currentPage - 1) * listAmount, listAmount).map((d, index) => (
              <tr key={index}>
                {[...listedProperty!.values()].map((value, i) => (
                  <td key={i} className="align-middle text-center" colSpan={i == 1 ? 2 : 1}>{value.GetPropertyValue(d)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
        <PaginationItem amount={pages} visiblePageLength={4} />
      </ >
    )
  }
  return CustomTable
}
export default CustomTableFactory