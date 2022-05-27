
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

export default function DashboardApp() {
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={3}>
          <Typography variant="h3" gutterBottom>
            {service ? service.name : '...'}
          </Typography>
          <Button
            variant="contained"
            onClick={()=>handleClickOpen('Api clé')}
          >
            Api
          </Button>
        </Stack>

        <Outlet service={service}/>
    <FormDialog service={service}  open={open} handleClickOpen={handleClickOpen} handleClose={handleClose}/>
        
      </Container>
    </Page>
  );
}

function FormDialog({service, open, handleClickOpen, handleClose}) {
  const { serviceId } = useParams();
  const [operatorMode, setOperatorMode] = useState('');
  const [amount, setOutAmount] = useState(10);

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" gutterBottom>
          {service ? service.name : '...'}
          </Typography>
          Api
        </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          Clé
          </DialogContentText>
          {service ? service.key : '...'}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Quitter</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}