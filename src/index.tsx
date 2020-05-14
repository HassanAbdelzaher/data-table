import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table, { Padding, Size } from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { EnhancedTableToolbar } from './toolbar';
import { EnhancedTableHead, HeadCell, Property } from './head';
import DeleteDialog, { DeleteDialogResult } from './dialog';
import { useTranslation } from 'react-i18next';
import {DataTableCell} from './table-cell'

const columnsPerPage = [10, 20, 50, 100, 200];
function descendingComparator(a: any, b: any, orderBy: Property | null) {
  if (orderBy == null) {
    return 0;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator(order: Order, orderBy: Property | null): (a: any, b: any) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
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

export interface DataTableProps<T> {
  data: Array<T>,
  columns: Array<HeadCell<T>>
  padding?: Padding;
  size?: Size;
  stickyHeader?: boolean;
  title?: string|React.ReactNode,
  showIndex?: boolean,
  onAdd?:()=>void
  onEdit?:(row:T)=>void
  onDelete?:(rows:T[])=>void
  onFilter?:()=>void
  autoGenerateColumns?:boolean
}
export const DataTable= function DataTable<T>(props: DataTableProps<T>) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<Property | null>(null);
  const [selected, setSelected] = React.useState<T[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [openDlg, setOpenDlg] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(columnsPerPage[0]);
  const rows = props.data || []
  let columns=props.columns||[]
  if (columns.length==0 && props.autoGenerateColumns){
    Object.keys(rows[0]).forEach((k)=>{
      columns.push({id:k,label:k})
    })
  }
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: Property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  useEffect(() => {
    setSelected([])
  }, [rows]);
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      //const newSelecteds = rows.map((n) => n.name);
      //setSelected(newSelecteds);
      setSelected(rows);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, ro: T) => {
    const selectedIndex = selected.indexOf(ro);
    let newSelected: T[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, ro);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (ro: any) => selected.indexOf(ro) !== -1;

  //const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const handleToolbarEdit=()=>{
    if(props.onEdit){
      if(selected.length==1){
        props.onEdit(selected[0])
        return;
      }
      if(selected.length>1){
        alert("error:multiple row selected");
      }
    }
  }
  const handleToolbarDelete=()=>{
    setOpenDlg(true);
    
  }
  const handleConfirmDelete=(rs:DeleteDialogResult)=>{
    setOpenDlg(false);
    if(props.onDelete && rs==DeleteDialogResult.OK){
      props.onDelete(selected||[])
    }
  }
  return (
      <Paper className={classes.paper}>
        <EnhancedTableToolbar title={props.title} numSelected={selected.length} onAdd={props.onAdd} onFilter={props.onFilter} onDelete={props.onDelete?handleToolbarDelete:undefined} onEdit={props.onEdit?handleToolbarEdit:undefined}  />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={props.size ? props.size : (dense ? 'small' : 'medium')}
            aria-label="enhanced table"
            stickyHeader={props.stickyHeader}
            padding={props.padding}
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              columns={props.columns}
              indexHeadCol={props.showIndex}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={"r"+index}
                      selected={isItemSelected}
                    >
                      {
                        props.showIndex && <TableCell padding="checkbox">
                          {page * rowsPerPage+index+1}
                        </TableCell>
                      }
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      {
                        (props.columns || []).map((col) => {
                          return <DataTableCell val={row[col.id]} col={col} row={row} rows={rows} component="th" id={labelId} scope="row" padding="none"></DataTableCell>
                        })
                      }
                    </TableRow>
                  );
                })}

            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={columnsPerPage}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
         <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label={t("Dense padding")}
      />
      <DeleteDialog open={openDlg} onClose={handleConfirmDelete} />
      </Paper>
     
  );
}