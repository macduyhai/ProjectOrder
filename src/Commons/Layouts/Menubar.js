import React from 'react';
import { makeStyles,useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { NavLink } from 'react-router-dom';

//Recoil
import { useRecoilState } from 'recoil';
import { openMenuState } from '../../Recoil/atom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    zIndex: 0
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },

}));
export default function Menubar() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useRecoilState(openMenuState);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>

      <Divider />
      <List className="form_link">
        {[
          {path: 'dashboard', name: 'DashBoard', image: 'dashboard.svg'},
          {path: 'order_management', name: 'Orders', image: 'order.svg'},
          {path: 'branch_sell', name: 'Branch Sells', image: 'share.svg'},
          {path: 'type_product', name: 'Type Products', image: 'product.svg'},
          {path: 'seller', name: 'Sellers', image: 'seller.svg'},
          {path: 'checking', name: 'Checking', image: 'checking.svg'}
        ].map((value, index) => (
          <NavLink to={`/${value.path}`} key={index}>
            <ListItem button key={value.path}>
              <ListItemIcon>
                {
                  <img src={value.image} className="m-2" alt="x" style={{'maxWidth': '25px'}} />
                }
              </ListItemIcon>
              <ListItemText primary={value.name} />
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Drawer>
  );
}
