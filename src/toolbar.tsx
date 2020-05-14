import React from 'react';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {Edit,Add} from '@material-ui/icons'
const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
    title: {
      flex: '1 1 100%',
    },
  }),
);

export interface EnhancedTableToolbarProps {
  numSelected: number;
  title: React.ReactNode | string | null,
  onAdd?:()=>void
  onEdit?:()=>void
  onDelete?:()=>void
  onFilter?:()=>void
}

export const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            {props.title}
          </Typography>
        )}
      {numSelected > 0 ? (
        <>
          {props.onDelete&&<Tooltip title="Delete">
            <IconButton  style={{color:'red'}} onClick={props.onDelete} aria-label="delete">
              <DeleteIcon  />
            </IconButton>
          </Tooltip>}
          {(props.onEdit&&numSelected==1)&&<Tooltip title="Edit">
            <IconButton onClick={props.onEdit} aria-label="edit">
              <Edit />
            </IconButton>
          </Tooltip>}
        </>
      ) : (
          <>
            {props.onFilter&&<Tooltip title="Filter list">
              <IconButton onClick={props.onFilter} aria-label="filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>}
            {props.onAdd&&<Tooltip title="New">
              <IconButton onClick={props.onAdd} aria-label="new">
                <Add />
              </IconButton>
            </Tooltip>}
          </>
        )}
    </Toolbar>
  );
};