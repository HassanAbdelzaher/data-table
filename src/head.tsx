import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';

export type Order = 'asc' | 'desc';
export  type Property=number|string|symbol
export interface HeadCell<T> {
  id: Property&keyof T;
  label: string;
  numeric?: boolean;
  disablePadding?: boolean;
  render?:(value:any,column:HeadCell<T>,row:T,rows:T[])=>React.ReactNode
  renderEdit?:(value:any,column:HeadCell<T>,row:T,rows:T[])=>React.ReactNode
}


export interface EnhancedTableProps<T> {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: Property) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: Property|null;
  rowCount: number;
  columns:Array<HeadCell<T>>
  indexHeadCol?:boolean
}

export function EnhancedTableHead<T>(props: EnhancedTableProps<T>) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: Property) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };
  const headCells=props.columns;
  return (
    <TableHead>
      <TableRow>
        {props.indexHeadCol&&<TableCell padding="checkbox"></TableCell>}
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell,idx) => (
          <TableCell
            key={headCell.id?.toString()||idx}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }),
);