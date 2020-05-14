import React,{ useState } from 'react'
import { HeadCell } from './head';
import {TableCell,TableCellProps,TextField} from '@material-ui/core';

export interface DataTableCellProps extends TableCellProps{
    val:any,
    col:HeadCell<any>,
    row?:any,
    rows?:any,
    onCellValueChange?:(val:any,col:HeadCell<any>)=>void
}
export const DataTableCell=(props:DataTableCellProps)=>{
    const {val,col,row,rows,onCellValueChange,...rest}=props
    const [isEditMode,setEditMode]=useState(false)
    const [value,setValue]=useState(val)
    const render=isEditMode?col?.renderEdit:col?.render
    const handleChange=(event)=>{
        setValue(event.target.value);
        if(onCellValueChange){
            onCellValueChange(event.target.value,col)
        }
    }
    const vComp=isEditMode?<TextField onBlur={()=>{setEditMode(false)}} onChange={handleChange} value={value}></TextField>:value
    console.info('render cell')
    return <TableCell onDoubleClick={()=>{setEditMode(true)}} {...rest}>
            {render?render(val,col,row,rows):vComp}
    </TableCell>
}