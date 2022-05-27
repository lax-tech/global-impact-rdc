import React, { useState , useEffect,  useContext, createContext} from "react";
import { useNavigate } from 'react-router-dom';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';

import axiosInstance from './axios.js';
// ----------------------------------------------------------------------
// pages for this product
const webSocket = new WebSocket(`wss://${window.location.hostname}:8000/ws/lax_medic/personal/`);

export default function App() {

    return (
    <div>
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />
      <ProvideAuth>
        <Router />
      </ProvideAuth>
    </ThemeConfig>
    </div>
        )
}


/* Fonc */
const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    cb(); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    cb()
  }
};

const authContext = createContext();

function useProvideAuth() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    authentifing: true, 
    is_auth: false
  });
  
  const [connectWebSocket, setConnectWebSocket] = React.useState(null);
  const [wsState, setWsState] = React.useState('');

  React.useEffect(() => {
    webSocket.onopen = () => setConnectWebSocket(webSocket);
    webSocket.onclose = () => {
      setConnectWebSocket(null);
      setWsState('disconnect');
    };
  }, []);

const signin = cb => {
  return fakeAuth.signin(() => setUser(cb()));
};

const signout = cb => {
  return fakeAuth.signout(() => {
    setUser({
      authentifing: false, 
      is_auth: false
    });
    cb();
  });
};

const handleUser = (data, cb) => {
    setUser(data);
    cb();
};

return {
  wsState,
  ws: connectWebSocket,
  user,
  signin,
  signout,
  handleUser
};
}

function ProvideAuth({ children }) {
  console.log('ProvideAuth')
  const auth = useProvideAuth();
/*   useEffect(() => {
    if(localStorage.getItem('access_token') !== "" && localStorage.getItem('refresh_token') !== ""){
      console.log('loging user')
      axiosInstance
        .get(`/account/get_user/`)
        .then((res) => {
          console.log('success')
          console.log(res.data) 
          handleLogin(res.data.user)
        }).catch((res) => {
              console.log('erreur depuis catch')
              handleLogin({
                authentifing: false, 
                is_auth: false
              })
        });
    }else{
      handleLogin({
        authentifing: false, 
        is_auth: false
      })
    }
  }, []) */
  
  const handleLogin = (user) => {
    console.log(user, 'ini handleLogin')
    auth.signin(() => {
      return user
    });
  };

  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export  function useAuth() {
  return useContext(authContext);
}