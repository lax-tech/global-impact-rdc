import faker from 'faker';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import googleFill from '@iconify/icons-eva/smartphone-fill';
import twitterFill from '@iconify/icons-eva/smartphone-fill';
import facebookFill from '@iconify/icons-eva/smartphone-fill';
import linkedinFill from '@iconify/icons-eva/smartphone-fill';
// material
import { Box, Grid, Card, Paper, Typography, CardHeader, CardContent } from '@mui/material';
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
import * as React from 'react';
import Button from '@mui/material/Button';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const SOCIALS = [
  {
    name: 'Vodacom',
    value: 'Vodacom',
    icon: <Icon icon={facebookFill} color="#EF3E30" width={32} height={32} />
  },
  {
    name: 'Airtel',
    value: "Airtel",
    icon: <Icon icon={googleFill} color="#DF3E30" width={32} height={32} />
  },
  {
    name: 'Orange',
    value: 'Orange',
    icon: <Icon icon={linkedinFill} color="#EE9910" width={32} height={32} />
  },
  {
    name: 'Africel',
    value: 'Africel',
    icon: <Icon icon={twitterFill} color="#CC9CEA" width={32} height={32} />
  }
];

// ----------------------------------------------------------------------

SiteItem.propTypes = {
  site: PropTypes.object
};

function SiteItem({ site, setOperatorMode }) {
  const { icon, value, name } = site;

  return (
    <Grid item xs={6}>
      <Paper onClick={()=>setOperatorMode(value)} variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
        <Box sx={{ mb: 0.5 }}>{icon}</Box>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          
        </Typography>
      </Paper>
    </Grid>
  );
}

export default function AppTrafficBySite({setOutAmount, balance, submit}) {
  const [age, setAge] = React.useState(243);
  const [step, setStep] = React.useState(0);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [paimentMode, setPaimentMode] = React.useState('mm');
  const [operator, setOperator] = React.useState('');
  const [title, setTitle] = React.useState('Combien vous vous retirer ?');
  const [reste, setReste] = React.useState(balance);
  const [ableAmount, setAbleAmount] = React.useState(0);
  const [amount, setAmount] = React.useState(10);
  const [isSubmiting, setIsSubmiting] = React.useState(null);

  React.useEffect(() => {
    setOutAmount(amount)
    if(step===1){
      setTitle('Moyen de retrait')
    }else if(step===2 && paimentMode==="mm"){
      setTitle('Moyen de retrait')
    } else if(step===3){
      setTitle('Entrez le numéro de retrait')
    }
  }, [step])

  const handle0peratorModeChange = (value) =>{
    setOperator(value);
    setStep(s=>s+1)
  }

  const handleAmountChange = e => {
    let sum = e.target.value
    if (balance - sum >= 10){
      setAmount(sum)
      setReste(balance-sum)
    }
  }

  const handleNextStep = (calback, params) => {
    calback(params);
    setStep(s=>s+1)
  }

  const handleSubmit = e =>{
    setIsSubmiting(true);
    submit({
      amount,
      mode: paimentMode,
      operator,
      number: age+''+ phoneNumber,
      balance_id: 1
    }, setIsSubmiting)
  }
  return (
    <>
      <CardHeader title={title} />
      <CardContent>
        {!step 
          ? <Grid container spacing={2}  style={{maxWidth: '300px'}}>
          <Grid item xs={6}  style={{textAlign: 'center'}}>
        <Typography variant="h6" sx={{ color: 'text.success' }}>{balance}$</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Balance</Typography>
          </Grid>
          <Grid item xs={6} style={{textAlign: 'center'}}>
        <Typography variant="h6">{reste}$</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Reste</Typography>
          </Grid>
          <Grid item xs={12}>
               <TextField fullWidth
                variant="filled"
                autoComplete="amount"
                value={amount}
                onChange={handleAmountChange}
                type="number"
                label="Montant à retirer"
                />
    </Grid>
    <Grid item xs={12}>
      <br />
<Button
                  fullWidth
                  size="large"
                  onClick={(e)=>setStep(s=>s+1)}
                  variant="contained"
                  disabled={ableAmount}
                 >
              Suivent
            </Button>
    </Grid>
          </Grid>
          : step ===1 ?     <ButtonGroup
          aria-label="vertical outlined button group"
    >
    <Button key="two" size="large" onClick={()=>handleNextStep(setPaimentMode, 'mm')}>Mobile money</Button>,
    <Button key="three" size="large" onClick={()=>handleNextStep(setPaimentMode, 'cc')}>Cart de credit</Button>,
    </ButtonGroup> 
            : step === 2 && paimentMode === "mm" ? <Grid container spacing={2}  style={{maxWidth: '300px'}}>
              {SOCIALS.map((site) => (
                <SiteItem key={site.name} site={site} setOperatorMode={handle0peratorModeChange} />
              ))}
            </Grid>
              : <Grid container spacing={2}  style={{maxWidth: '300px'}}>
              <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Pay</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue={243}
                  onChange={(e)=>setAge(e.target.value)}
                  label="Country"
                >
                  <MenuItem value={243}>🇨🇩 Congo Kinshasa</MenuItem>
                    </Select>
                   </FormControl>
        </Grid>
        <Grid item xs={12}>
                   
                   <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
                     <p style={{fontSize: 20, marginTop: 22, marginRight:3}} >+{age}</p>
                   <TextField
                    fullWidth
                    variant="filled"
                    autoComplete="phone_number"
                    type="number"
                    value={phoneNumber}
                    onChange={(e)=>setPhoneNumber(e.target.value)}
                    label="Numéro de retrait"
                    />
                    </div>
        </Grid>
        <Grid item xs={12}>
        <br />
    <LoadingButton
                      fullWidth
                      size="large"
                      type="submit"
                      onClick={handleSubmit}
                      variant="contained"
                      loading={isSubmiting}
                     >
                  Retirer
                </LoadingButton>
        </Grid>
              </Grid>
        }
      </CardContent>
    </>
  );
}
