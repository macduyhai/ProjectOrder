import React from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
//Layouts
import MenuBar from '../Commons/Layouts/Menubar';
import Header from '../Commons/Layouts/Header';
//Components
import Order from '../Components/Order';
import BranchSell from '../Components/BranchSell';
import TypeProduct from '../Components/TypeProduct';
import Seller from '../Components/Seller';
import DashBoard from '../Components/DashBoard';
import Checking from '../Components/Checking';
function ReactRouter() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header />
      <MenuBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Route path="/" exact component={DashBoard} />
        <Route path="/dashboard" component={DashBoard} />
        <Route path="/order_management" component={Order} />
        <Route path="/branch_sell" component={BranchSell} />
        <Route path="/type_product" component={TypeProduct} />
        <Route path="/seller" component={Seller} />
        <Route path="/checking" component={Checking} />
      </main>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));
export default withRouter(ReactRouter);
