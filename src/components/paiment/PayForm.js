import * as Yup from 'yup';
import {Link as RouterLink } from 'react-router-dom';
// material
import {  Link } from '@mui/material';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import axiosInstance from '../../axios.js';
// ----------------------------------------------------------------------

export default function RegisterForm({productId, amount, paimentMode}) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const RegisterSchema = Yup.object().shape({
    phone_number: Yup.number()
      .required('Le numéro de name téléphone est obligatoire'),
  });

  const formik = useFormik({
    initialValues: {
      phone_number: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: (values, { setSubmitting }) => {
      axiosInstance
        .post(`/business_api/paiement/product/${productId}/`,
        {
          mode: "mm",
          type: paimentMode,
          amount: amount
        })
        .then((res) => {
          console.log('Responce')
          console.log(res.data)
          setSubmitting(false)
        }).catch((res) => {
                  console.log('erreur depuis ca')
                  console.log(res)
                  setSubmitting(false)
        });
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'row', sm: 'row' }} spacing={1}>
      <FormControl sx={{
        minWidth: 110,
      }}>
        <InputLabel id="demo-simple-select-label">Pays</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Pays"
          onChange={handleChange}
        >
          <MenuItem value={10}>🇨🇩+243</MenuItem>
          <MenuItem value={20}>RC</MenuItem>
          <MenuItem value={30}>ANG</MenuItem>
        </Select>
      </FormControl>

            <TextField
              fullWidth
              label="Numero de téléphone"
              {...getFieldProps('phone_number')}
              error={Boolean(touched.phone_number && errors.phone_number)}
              helperText={touched.phone_number && errors.phone_number}
            />
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Payer
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
