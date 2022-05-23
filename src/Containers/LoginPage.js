import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { endpoints } from '../api';
import { useHttp } from '../hooks/http.hook';
import { login } from '../Redux/actions/auth.actions';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const LoginPage = () => {
  const history = useHistory();
  const classes = useStyles();
  const { request } = useHttp();
  const dispatch = useDispatch();

  const submitLoginHandler = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        login: e.target.email.value,
        password: e.target.password.value,
      };
      const data = await request(endpoints.login(), 'POST', payload);
      localStorage.setItem('userToken', data.payload.token);
      dispatch(
        login(
          data.payload.token,
          data.payload.observer,
          data.payload.organizationCard
        )
      );
      history.push('/');
    } catch (e) {
      toast.error(e.message, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Войти
        </Typography>
        <form
          className={classes.form}
          onSubmit={(e) => submitLoginHandler(e)}
          validate="true"
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Логин"
            name="email"
            autoComplete="email"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Войти
          </Button>
        </form>
      </div>
      {/*<ToastContainer />*/}
    </Container>
  );
};
