import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CircularProgressWithLabel(props) {
  return (
      <div>
        <Typography variant="h6" component="h1" color="text.primary">
            Véillez comfirmer
        </Typography>
        <Typography variant="caption" component="p" color="text.secondary" >
            La transaction
        </Typography>
    <Box sx={{ position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', }}>
      <CircularProgress variant="determinate" {...props} size={100} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}sec`}
        </Typography>
      </Box>
    </Box>
    </div>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export default function CircularStatic() {
  const [progress, setProgress] = React.useState(10);
  const [progressColor, setProgressColor] = React.useState('primary');

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 80){
            setProgressColor('error')
        }else if (prevProgress >= 50){ 
            setProgressColor('secondary')
        }else{
            setProgressColor('primary')
        }
        return prevProgress >= 100 ? 0 : prevProgress + 10
    });

    }, 700);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <CircularProgressWithLabel value={progress} color={progressColor} />;
}