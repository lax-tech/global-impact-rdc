import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
import * as React from 'react';
import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
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
  name: '',
  type: '',
  description: ''
}

function HorizontalLinearStepper() {
  const imageRef = useRef(null);
  console.log('HorizontalLinearStepper --------------')
  const auth = useAuth()
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [age, setAge] = React.useState(243);

  const handleChange = (event) => {
    if(event.target.name=== "image"){
      console.log(imageRef.current)
      imageRef.current.src = URL.createObjectURL(event.target.files[0])
      data = {...data, [event.target.name]: event.target.files[0]}
    }else{
      data = {...data, [event.target.name]: event.target.value}
    }
    console.log(data)
  };
  
  
  const handleLogin = (user) => {
    console.log(user, 3)
    auth.handleUser(user, () => {
      navigate('/dashboard', { replace: true });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true)

    let formData = new FormData();

    for (let k in data){
      formData.append(k, data[k]);
      console.log(k, data[k])
    }
    formData.append('file', data.image)
    console.log(formData)

    axiosInstance
    .post(`business_api/services/`, formData,{
      headers: {
        'Content-Type': 'muiltipart/form-data'
      }
    })
    .then((res) => {
      console.log('success')
      console.log(res.data)
      navigate('/dashboard/services', { replace: true });
    }).catch((res) => {
              console.log('erreur depuis ca')
              setIsSubmitting(false)
    });

  };

  return (
    <Box sx={{ p:2 }}>
          <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: '10px 0', width: '100%' },
      }}
      noValidate
      autoComplete="off"
      onChange={handleChange}
      onSubmit={handleSubmit}
    >
      <h3>Engistrer votre service</h3>
      <Grid container spacing={3} justifyContent='center'>
      <Grid item xs={12} sm={ 6} md={6} >
            <TextField
              fullWidth
              label="Nom de votre service"
              name="name"
              />
              
          <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={243}
          label="Country"
          name="type"
        >
          <MenuItem value={243}>E-commerce</MenuItem>
          <MenuItem value={20}>Don</MenuItem>
          <MenuItem value={30}>E-commerce</MenuItem>
            </Select>
           </FormControl>
           
        <TextField
              fullWidth
          id="filled-multiline-static"
          label="Description"
          multiline
          maxRows={3}
          variant="filled"
          name="description"
        />
      </Grid>

      <Grid item xs={12} sm={ 6} md={6}>
        <input type="file" name="image" />
        <div style={{textAlign: 'center', display: 'flex', justifyContent:'center'}}>
        <img src="" alt="image" ref={imageRef} style={{maxWidth: "100%", maxHeight: '270px'}} />
        </div>
      </Grid>
      </Grid>
        <LoadingButton
    fullWidth
    size="large"
    type="submit"
    variant="contained"
    loading={isSubmitting}
  >
    Enregistrer
  </LoadingButton>
      </Box>
    </Box>
  );
}


export default function RegisterForm() {
  console.log('je suis là')

  return (
      <HorizontalLinearStepper />
  );
}
