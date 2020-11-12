import React from 'react';
import { RecoilRoot } from 'recoil';
import LoginFaceBook from './Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ReactRouter from './Router/ReactRouter';

import {
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
      <RecoilRoot>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Router>
            <Switch>
              <Route path="/login" render={() => <LoginFaceBook />} />
              <ReactRouter />
            </Switch>
          </Router>
        </MuiPickersUtilsProvider>
      </RecoilRoot>
  );
}

export default App;
