import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import axiosInstance from '../../../axios.js';

import {useAuth} from '../../../App';

const steps = ['Identité', 'Adresse', 'Sécurité'];

let data = {
  image: null
}

function HorizontalLinearStepper() {
  console.log('HorizontalLinearStepper --------------')
  const auth = useAuth()
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [showPassword, setShowPassword] = useState(false);
  const [age, setAge] = React.useState(243);

  const handleChange = (event) => {
    if(event.target.name=== "image"){
      console.log(event.target.files[0])
      data = {...data, [event.target.name]: event.target.files[0]}
    }else{
      data = {...data, [event.target.name]: event.target.value}
    }
    console.log(data)
  };
  
  const LoginSchema = Yup.object().shape({
    first_name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    last_name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    town: Yup.string().required('Votre ville actuelle est obligatoire'),
    address: Yup.string().required('Votre addresse est obligatoire'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phone_number: Yup.number('Entrez votre numéro de téléphone').required('Entrez votre numéro de téléphone'),
    password: Yup.string().required('Password is required'),
    password_comfirm: Yup.string().when("password", {
      is: val => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("password")],
        "Le mot de passe doit ne correspond pas"
      )
    })
  });

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      country: 243,
      town: '',
      address: '',
      phone_number: '',
      password: '',
      password_comfirm:''
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      console.log(JSON.stringify({...values}, null, 6));
      
      let formData = new FormData();

      for (let k in values){
        formData.append(k, values[k]);
      }
      formData.append('file', data.image)
      formData.append('phone_number', values.country+''+values.phone_number)
      console.log(formData)
      axiosInstance
        .post(`account/register_user/`, formData,{
            headers: {
              'Content-Type': 'muiltipart/form-data'
            }
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

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit} onChange={handleChange}>
      {activeStep !== steps.length ?  (
        <React.Fragment>
          <div style={{minHeight: 250, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Stack spacing={3}  style={{width: '100%' }} >
            {activeStep == 0
              ?<>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Nom"
              {...getFieldProps('last_name')}
              error={Boolean(touched.last_name && errors.last_name)}
              helperText={touched.last_name && errors.last_name}
              />
                <TextField
              fullWidth
              label="Prénom"
              {...getFieldProps('first_name')}
              error={Boolean(touched.first_name && errors.first_name)}
              helperText={touched.first_name && errors.first_name}
              />
          </Stack>
              <TextField
                fullWidth
                autoComplete="email"
                type="email"
                label="Email address"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
              </>
              : null
            }

          {activeStep== 1
           ?<>
           
          <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Pay</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={243}
          {...getFieldProps('country')}
          label="Country"
        >
          <MenuItem value={243}>🇨🇩 RDC</MenuItem>
            </Select>
           </FormControl>
           
           <TextField
              fullWidth
              label="La ville où vous ètes"
              {...getFieldProps('town')}
              error={Boolean(touched.town && errors.town)}
              helperText={touched.town && errors.town}
              />
            <TextField
            fullWidth
            autoComplete="address"
            label="Votre addresse"
            {...getFieldProps('address')}
            error={Boolean(touched.address && errors.address)}
            helperText={touched.address && errors.address}
            />
            </>
            : null
          }


          {activeStep== 2
           ?<>
           <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
             <p style={{fontSize: 20, marginTop: 22, marginRight:5}} >+{age}</p>
           <TextField
            fullWidth
            variant="filled"
            autoComplete="phone_number"
            type="number"
            label="Numéro de téléphone"
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
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
            />
           <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Comfirmer"
            {...getFieldProps('password_comfirm')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password_comfirm && errors.password_comfirm)}
            helperText={touched.password_comfirm && errors.password_comfirm}
            />
            </>
            :null
          }
        </Stack>
        </div>
        
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Retour
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button 
              disabled={true} color="primary" onClick={handleSkip} sx={{ mr: 1 }}>
                Ignorer
              </Button>
            )}

            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Enregistrer' : 'Suivent'}
            </Button>
          </Box>
        </React.Fragment>
        )
        :(
          <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2, pb:2 }}>
              <Box sx={{ flex: '1 1 auto' }} >
                <input type="file" name='image' onChange={handleChange} />
            <Typography sx={{ mt: 2, mb: 1 }}>
              Choissez une photo de profil
            </Typography>

              </Box>
              <Button onClick={handleReset}>Reset</Button>
            </Box>
  <LoadingButton
    fullWidth
    size="large"
    type="submit"
    variant="contained"
    loading={isSubmitting}
  >
    Enregistrer
  </LoadingButton>
          </React.Fragment>
        ) }
      </Form>
    </FormikProvider>
    </Box>
  );
}


export default function RegisterForm() {
  console.log('je suis là')

  return (
      <HorizontalLinearStepper />
  );
}
