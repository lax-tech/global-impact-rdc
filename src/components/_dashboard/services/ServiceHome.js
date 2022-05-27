
import { useState, useEffect } from 'react';
import {Outlet, useParams, Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Container, Typography,
  Button,
  Stack } from '@mui/material';
  
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

  import { Icon } from '@iconify/react';
  import plusFill from '@iconify/icons-eva/list-fill';
// components
import Page from '../../../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from './IndexService';

import Products from '../../../pages/Products';

import axiosInstance from '../../../axios.js';
import {useAuth} from '../../../App';

// ----------------------------------------------------------------------

export default function DashboardApp({}) {
    const { serviceId } = useParams();
    const [service, setService] = useState('');
  const [paimentMode, setPaimentMode] = useState('');
  
  const [open, setOpen] = useState(false);

  const handleClickOpen = (m) => {
    setOpen(true);
    setPaimentMode(m)
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axiosInstance
    .get(`business_api/services/${serviceId}/`)
    .then((res) => {
      console.log('success')
      console.log(res.data)

      setService(res.data);
        
    }).catch((res) => {
        console.log('erreur depuis ca')
    });
  }, [])

  return (
    <Page title="Dashboard | Minimal-UI">
      <Container maxWidth="xl">          
        
    <FormDialog paimentMode={paimentMode} balance={service ? service.balance : null} open={open} handleClickOpen={handleClickOpen} handleClose={handleClose}/>
        <Grid container spacing={3} justifyContent="space-between">
{/*           <Grid item xs={12} sm={6} md={3}>
            <AppWeeklySales />
          </Grid> */}
          <Grid item xs={12} sm={6} md={3}>
            <AppNewUsers balance={service ? service.balance.amount : 'loading...'} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="contained"
            onClick={()=>handleClickOpen('Mobile money')}
          >
            Retirer de l'argent
          </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="contained"
            component={RouterLink}
            to="reports"
            startIcon={<Icon icon={plusFill} />}
          >
            Rapport
          </Button>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <Products products={service ? service.products : ''} />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}

function FormDialog({balance, paimentMode, open, handleClickOpen, handleClose}) {
  const { serviceId } = useParams();
  const [operatorMode, setOperatorMode] = useState('');
  const [amount, setOutAmount] = useState(10);

  const submit = (data, setIsSubmiting) => {
    console.log(data)
    axiosInstance
    .post(`output_money/${serviceId}/`, data)
    .then((res) => {
      console.log('success --------------')
      console.log(res.data)
      setIsSubmiting(false)
      handleClose()
    }).catch((res) => {
        console.log('erreur depuis ca')
        setIsSubmiting(false)
    });
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" gutterBottom>
          Retrait
          </Typography>
          {amount}$
        </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          {paimentMode}
          </DialogContentText>
        </DialogContent>
            <AppTrafficBySite setOutAmount={setOutAmount} balance={balance ? balance.amount : 0} submit={submit} />
        <DialogActions>
          <Button onClick={handleClose}>Retour</Button>
          <Button onClick={handleClose}>Quitter</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
