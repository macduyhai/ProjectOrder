import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import swal from 'sweetalert';

import { HOST, HOST2 } from '../Config';
const axios = require('axios');

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingTop: theme.spacing(12),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    axios({
      method: 'get',
      url: `${HOST}/v1/auth/access_token?username=${username}&password=${password}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': ' application/json;charset=UTF-8',
      },
    })
      .then(function (response) {
        if (response.status !== 200) {
          swal('Lỗi!', 'Đăng nhập thất bại', 'error');
          return;
        }
        if (response.data.meta.code === 200) {
          localStorage.setItem('access_token', response.data.data.access_token);
          localStorage.setItem('time_login', response.data.meta.timestamp);
          localStorage.setItem('time_access_token', response.data.data.expired_in);
          localStorage.setItem('client_id', username);
          pushAcessToken(response.data.data.access_token)
        } else {
          swal('Lỗi!', 'Đăng nhập thất bại', 'error');
        }
      })
      .catch(function (error) {
        swal('Lỗi!', 'Đăng nhập thất bại', 'error');
      });
  };

  const pushAcessToken = (access_token) => {
    fetch(`${HOST2}/api/v1/authenkey?Key=${access_token}&CreatedAt`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': ' application/json;charset=UTF-8',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.meta.Code === 200) {
          window.location.href = '/';
        } else {
          swal('Lỗi!', 'Đăng nhập thất bại', 'error');
        }
      })
      .catch((error) => {
        swal('Lỗi!', 'Đăng nhập thất bại', 'error');
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className="col-md-12 mb-3 p-0">
          <img src="logo.png" className="col-md-12 p-0"/>
        </div>
        <form className={classes.form} onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Đăng Nhập
          </Button>
        </form>
      </div>
    </Container>
  );
}
