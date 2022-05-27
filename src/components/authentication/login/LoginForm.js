import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import axiosInstance from '../../../axios.js';

import {useAuth} from '../../../App';

// ----------------------------------------------------------------------

export default function LoginForm() {
  console.log('loginForm --------------')
  const auth = useAuth()
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [contry, setContry] = useState(243);

  const LoginSchema = Yup.object().shape({
    phone_number: Yup.number('Entrez votre numéro de téléphone').required('Entrez votre numéro de téléphone'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      phone_number: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
      
      console.log(JSON.stringify({
        username: contry+''+values.phone_number,
        password: values.password
      }, null, 2));
      
      axiosInstance
        .post(`/account/login/`, {
          username: contry+''+values.phone_number,
          password: values.password
        })
        .then((res) => {
          console.log('success')
          console.log(res.data)
          localStorage.setItem('access_token', res.data.user_tokens.access);
          localStorage.setItem('refresh_token', res.data.user_tokens.refresh);
          axiosInstance.defaults.headers['Authorization'] =
            'JWT ' + localStorage.getItem('access_token');

          setSubmitting(true)
          handleLogin(res.data.user)
          
        }).catch((res) => {
                  console.log('erreur depuis ca')
                  console.log(res)
                  setSubmitting(false)
        });
    }
  });

  const handleLogin = (user) => {
    console.log(user, 3)
    auth.handleUser(user, () => {
      navigate('/dashboard', { replace: true });
    });
  };

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
                     
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Pays</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={243}
          label="Country"
          onChange={(value) => setContry(value.target.value)}
        >
          <MenuItem value={243}>🇨🇩 RDC</MenuItem>
            </Select>
           </FormControl>

<div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
             <p style={{fontSize: 20, marginTop: 22, marginRight:1}} >+{contry}</p>
             <TextField
            fullWidth
            variant="filled"
            autoComplete="phone_number"
            type="number"
            label="Numero de telephone"
            {...getFieldProps('phone_number')}
            error={Boolean(touched.phone_number && errors.phone_number)}
            helperText={touched.phone_number && errors.phone_number}
          />
            </div>

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#">
            Mot de passe oublié ?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
