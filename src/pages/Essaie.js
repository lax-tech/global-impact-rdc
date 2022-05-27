import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SuccessIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/PersonTwoTone';

import CircularProgress from '@mui/material/CircularProgress';
import { green, cyan } from '@mui/material/colors';


import axiosInstance from '../axios.js';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="">
        Akelax technologie
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function SignInSide({webSocket, ...props}) {


  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState('Identifiez-vous');
  const [saveDataForm, setSaveDataForm] = React.useState(true);

	const initialFormData = Object.freeze({
		username: '',
		password: '',
	});

  const [values, setValues] = React.useState({
		amount: '',
		password: '',
		weight: '',
		weightRange: '',
		showPassword: false,
	  });
	
	  const handleClickShowPassword = () => {
		setValues({ ...values, showPassword: !values.showPassword });
	  };
	
	  const handleMouseDownPassword = (event) => {
		event.preventDefault();
	  };

	const [formData, updateFormData] = useState(initialFormData);

	const handleChange = (e) => {
		updateFormData({
			...formData,
			[e.target.name]: e.target.value.trim(),
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
    
		axiosInstance
			.post(`/token/`, {
				username: formData.username,
				password: formData.password,
			})
			.then((res) => {
        console.log('success')
				localStorage.setItem('access_token', res.data.access);
				localStorage.setItem('refresh_token', res.data.refresh);
				axiosInstance.defaults.headers['Authorization'] =
					'JWT ' + localStorage.getItem('access_token');
        
			}).catch((res) => {
                console.log('erreur depuis ca')
			});
  };

  const handleLogin = (user)=>{
    if(saveDataForm){      
      localStorage.setItem('azerty', formData.username)
      localStorage.setItem('querty', formData.password)
    }
  }

  return (
  <div>
    <Grid container component="main" >
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7}  />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div>
        <div>
          {
            status === 'Identifiez-vous'
              ? <>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                  <Typography component="p" variant="h5">
                    {status}
                  </Typography>
                </>
              : status === 'success'
                  ? <>
                      <Avatar>
                        <SuccessIcon />
                      </Avatar>
                      <Typography component="p" variant="h5">
                        Bienvenu(e) !!!
                      </Typography>
                    </>
                  : status === 'not allowed'
                      ? <>
                          <Avatar>
                            <LockOutlinedIcon />
                          </Avatar>
                          <Typography component="p" variant="h5">
                            Vous êtes pas permi d'entrer
                          </Typography>
                        </>
                      : <>
                          <Avatar>
                            <LockOutlinedIcon />
                          </Avatar>
                          <Typography component="p" variant="h5">
                            Identifiant incorrect
                          </Typography>
                        </>
          }
          <form method="POST" action="." onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Votre nom"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={values.showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
              InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
                </InputAdornment>)
              }}
            />
            <FormControlLabel
              control={<Checkbox checked={saveDataForm} onChange={()=> setSaveDataForm(v=>!v)} color="primary" name='remember' />}
              label="se rappeler de moi"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
            >{loading && <CircularProgress size={24} />}
              Se connecter
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
        </div>
      </Grid>
    </Grid>
  </div>
  );
}