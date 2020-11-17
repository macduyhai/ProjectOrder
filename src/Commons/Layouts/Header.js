import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
//Recoil
import { useRecoilState } from 'recoil';
import { openMenuState } from '../../Recoil/atom';

const drawerWidth = 240;
export default function Header() {
  const classes = useStyles();
  const [open, setOpen] = useRecoilState(openMenuState);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const openProfile = Boolean(anchorEl);

  useEffect(() => {
    var access_token = localStorage.getItem('access_token')
    var time_login = localStorage.getItem('time_login')
    if (time_login !== null) {
      time_login = Math.round(new Date(time_login).getTime()/1000)
    }
    var timeNow = Math.round(new Date().getTime()/1000)
    var time_access_token = localStorage.getItem('time_access_token')

    if (access_token === null || (timeNow - time_login) > time_access_token) {
      setIsLogin(false)
    }
  }, [])

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    setIsLogin(false);
    localStorage.clear();
  };
  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      {!isLogin && <Redirect to={'/login'} />}
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, open && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap className={classes.title}>
          {/* Order Management */}

        </Typography>
        <div>
          <Avatar
            alt="Avata"
            src={''}
            onClick={handleMenu}
            className={classes.avata}
          />
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={openProfile}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}
const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  avata: {
    cursor: 'pointer',
    float: 'right',
  },
}));
