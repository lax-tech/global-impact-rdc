import {Outlet, useParams, Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Card, Link, Container, Typography } from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import RegisterForm  from '../components/paiment/PayForm';
import Counter from '../components/paiment/Counter';
import AuthSocial from '../components/authentication/AuthSocial';

import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import axiosInstance from '../axios.js';

function FormDialog({productId, amount, paimentMode, open, handleClickOpen, handleClose}) {

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{paimentMode}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Votre numero.
          </DialogContentText>
          <br />
        <RegisterForm productId={productId} amount={amount} paimentMode={paimentMode}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));
// ----------------------------------------------------------------------

export default function Register() {
  let { productId, amount } = useParams();

  const [state, setState] = React.useState("")

  React.useEffect(() => {
    axiosInstance
      .get(`/business_api/paiement/product/${productId}/`)
      .then((res) => {
        console.log('success')
        console.log(res.data)
        setState(res.data)
      }).catch((res) => {
                console.log('erreur depuis ca')
                console.log(res)
      });
  }, [])

  const [value, setValue] = React.useState(0);
  const [paimentMode, setPaimentMode] = React.useState('');
  
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (m) => {
    setOpen(true);
    setPaimentMode(m)
  };

  const handleClose = () => {
    setOpen(false);
  };
  
const buttons = [
  <Button key="one" size="large"  onClick={()=>handleClickOpen('M-pesa')}>M-psa</Button>,
  <Button key="one" size="large" onClick={()=>handleClickOpen('Orange money')}>Orange money</Button>,
  <Button key="two" size="large" onClick={()=>handleClickOpen('Airtel money')}>Airtel money</Button>,
  <Button key="three" size="large" onClick={()=>handleClickOpen('Africel money')}>Africel money</Button>,
];

  return (
    <RootStyle title="Register | Minimal-UI">
      <AuthLayout>
        j'ai un compte &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/login">
          je me connecte
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h5" sx={{ px: 5, mt: 12, mb: 0 }}>
            {state ? state.name : '...'}
          </Typography>
          <Typography variant="p" sx={{ px: 5, mt: 0, mb: 1 }}>
            Montant à payer  {amount}$
          </Typography>
          <img alt="register" src={state ? state.image : "/static/illustrations/illustration_register.png"} />
          <Typography variant="h6" sx={{ px: 5, mt: 2, mb: 0 }}>
            Description
          </Typography>
          <Typography variant="p" sx={{ px: 5, mt: 0, mb: 2 }}>
            {state ? state.description : '...'}
          </Typography>
        </SectionStyle>
      </MHidden>

      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h3" >
                EyanoPay
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Payez en toute securité avec EyanoPay.
            </Typography>
          </Box>

          <Box  sx={{  }} elevation={3}>
            <Typography variant="subtitle1" component="p" align="center">
                Je paie par 
            <div style={{ textAlign: 'center'}}>
            <div style={{display: 'inline-block', textAlign: 'center', borderBottom: "4px solid #5a5", width: 0}}></div>
            </div>
            </Typography>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
      <BottomNavigationAction label="EyanoPay" icon={<FavoriteIcon />} />
      <BottomNavigationAction label="Mobile money" icon={<PhoneIphoneIcon />} />
      <BottomNavigationAction label="Cart de credit" icon={<CreditCardIcon />} />
      </BottomNavigation>
    </Box>
    <br />
    <FormDialog productId={productId} amount={amount} paimentMode={paimentMode} open={open} handleClickOpen={handleClickOpen} handleClose={handleClose}/>

{value === 1
  ? <>
  <Typography variant="p" gutterBottom>
                  Choisissez un operateur
              </Typography>
    <ButtonGroup
        orientation="vertical"
        aria-label="vertical outlined button group"
  >
    {buttons}
  </ButtonGroup>
  </>
  : "Pas disponible"}


    {/* 
<Typography variant="h1" gutterBottom>
                
            </Typography>

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
            By registering, I agree to Minimal&nbsp;
            <Link underline="always" sx={{ color: 'text.primary' }}>
              Terms of Service
            </Link>
            &nbsp;and&nbsp;
            <Link underline="always" sx={{ color: 'text.primary' }}>
              Privacy Policy
            </Link>
            .
          </Typography>

          <MHidden width="smUp">
            <Typography variant="subtitle2" sx={{ mt: 3, textAlign: 'center' }}>
              Already have an account?&nbsp;
              <Link to="/login" component={RouterLink}>
                Login
              </Link>
            </Typography>
          </MHidden> */}
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
