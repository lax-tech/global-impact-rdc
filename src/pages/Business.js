import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, Outlet, navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// material
import {
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Page from '../components/Page';
import CircularProgress from '@mui/material/CircularProgress';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/services';
//
import USERLIST from '../_mocks_/user';

import axiosInstance from '../axios.js';
import {useAuth} from '../App';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export default function User() {
  const auth =  useAuth();
  const navigate          = useNavigate();
  const [profil, setProfil] = useState(null);


  useEffect(() => {
    if (!auth.user.profils.business || auth.user.profils.business ===[] ){
      navigate('/dashboard/business/register', { replace: true });
    } 
  }, [])


  return (
    <Page title="Business | Lax">
      <Container>
        <Outlet />
      </Container>
    </Page>
  );
}

function Loading() {
  const style = {
    position: 'fixed',
    height: '95vh',
    width: '70%',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#fff5',
    alignItems: 'center',
  }

  return (
    <div style={style}>
      <CircularProgress/>
      Chargement
    </div>
  );
}
