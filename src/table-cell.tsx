import React,{ useState } from 'react'
import { HeadCell } from './head';
import {TableCell,TableCellProps,TextField} from '@material-ui/core';

export interface DataTableCellProps extends TableCellProps{
    val:any,
    col:HeadCell<any>,
    row?:any,
    rows?:any
}
export const DataTableCell=(props:DataTableCellProps)=>{
    const {val,col,row,rows,...rest}=props
    const [isEditMode,setEditMode]=useState(false)
    const [value,setValue]=useState(val)
    const render=isEditMode?col?.renderEdit:col?.render
    const handleChange=(event)=>{
        setValue(event.target.value);
    }
    const vComp=isEditMode?<TextField onChange={handleChange} onBlur={()=>{row[col.id]=value,setEditMode(false);}} defaultValue={value}></TextField>:value
    return <TableCell onDoubleClick={()=>{setEditMode(true)}} {...rest}>
            {render?render(val,col,row,rows):vComp}
    </TableCell>
}