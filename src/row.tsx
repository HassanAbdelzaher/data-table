import React, { useState } from 'react'
import { HeadCell } from './head';
import { TableRow, TableRowProps, TableCell, Checkbox } from '@material-ui/core';
import { DataTableCell } from './table-cell'
export interface DataTableCellProps<T> extends TableRowProps {
    row: any,
    columns:HeadCell<T>[]
    rows?: any,
    showIndex?: boolean,
    //isItemSelected?: boolean,
    index?: number,
    onRowChange?:(row:any,col:HeadCell<any>)=>void
}
export const DataTableRow = (props: DataTableCellProps<any>) => {
    const { row, rows, selected, showIndex, index,columns,onRowChange, ...rest } = props
    const [isEditMode, setEditMode] = useState(false)
    const [datarow, setRow] = useState(row)
    const handleChange = (val:any,col:HeadCell<any>) => {
        let nwRo={...datarow,[col.id]:val}
        setRow(nwRo);
        if(onRowChange){
            onRowChange(nwRo,col)
        }
    }
    const labelId = `enhanced-table-checkbox-${index}`;
    console.info('render row')

    return (
        <TableRow {...rest} >{
            showIndex && <TableCell padding="none">
                {index}
            </TableCell>
        }
            <TableCell padding="none">
                <Checkbox
                    checked={selected}
                    inputProps={{ 'aria-labelledby': labelId }}
                />
            </TableCell>
            {
                (columns || []).map((col) => {
                    return <DataTableCell onCellValueChange={handleChange} val={datarow[col.id]} col={col} row={datarow} rows={rows} component="th" id={labelId} scope="row" padding="none" ></DataTableCell>
                })
            }</TableRow>

    )
}