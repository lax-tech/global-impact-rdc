import React, { useState , useEffect, Suspense,  useContext, createContext} from "react";
import { createBrowserHistory } from "history";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

// pages for this product
import { makeStyles } from '@material-ui/core/styles';
import {pink, blue} from '@material-ui/core/colors';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import CircularProgress from '@material-ui/core/CircularProgress';

import "assets/css/material-dashboard-react.css?v=1.9.0";

// core components
const Login = React.lazy(() => import("layouts/Login"));
const Main = React.lazy(() => import("layouts/Main.js"));


export default function App({webSocket}) {  
  const [darkMode, setDarkMode] = React.useState(JSON.parse(localStorage.getItem('darkMode')) || false )

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? 'dark' : 'light',
          primary:  blue,
          secondary: pink,
        },
      }),
    [darkMode],
  );

  React.useEffect(() => {
    localStorage.setItem('darkMode',JSON.stringify(darkMode));
  }, [darkMode])

    return (
    <div>
        <ProvideAuth>
      <ThemeProvider theme={theme}>
      <CssBaseline/>
            <Router>
                <Suspense fallback={<LinearBuffer/>}>
                  <div>
                    <Switch>
                        <Route path="/public">
                            <PublicPage />
                        </Route>
                        <Route path="/login">
                          <Login webSocket={webSocket}/>
                        </Route>
                        <PrivateRoute path="/lax_medic" webSocket={webSocket} Component={Main}/>
                        <Redirect from='/'  to='lax_medic' />
                    </Switch>
                  </div>
                </Suspense>
              </Router>
       </ThemeProvider>
    </ProvideAuth>
          </div>
        )
}

function LinearBuffer() {
    const useStyles = makeStyles({
    root: {
      position: 'fixed',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'white',
      alignItems: 'center',
    },
  });
    const classes = useStyles();
    return (
      <div className={classes.root}>
        <CircularProgress/>
      </div>
    );
  }

  const fakeAuth = {
    isAuthenticated: false,
    signin(cb) {
      fakeAuth.isAuthenticated = true;
      setTimeout(cb, 100); // fake async
    },
    signout(cb) {
      fakeAuth.isAuthenticated = false;
      setTimeout(cb, 100);
    }
  };
  
const authContext = createContext();
 
function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = cb => {
    return fakeAuth.signin(() => {
      setUser(cb());
    });
  };

  const signout = cb => {
    return fakeAuth.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout
  };
}

  function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return (
      <authContext.Provider value={auth}>
        {children}
      </authContext.Provider>
    );
  }
  
export  function useAuth() {
    return useContext(authContext);
  }
  
  // A wrapper for <Route> that redirects to the login
  // screen if you're not yet authenticated.
  function PrivateRoute({ webSocket, Component, ...rest }) {
    const [isLoading, setIsLoading] = useState(true);
    console.log('private')
    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();

    useEffect(() => {
      if(auth.user){
        setIsLoading(null)
      }else{

        setTimeout(() => {
            webSocket.send(JSON.stringify({
            type: 'init'
            }))
        }, 500);

        webSocket.onmessage = (e)=>{
          const data = JSON.parse(e.data);
          console.log(data)

          if(data.type === "init"){
            console.log(data.content)

            if(data.content.is_auth){
              console.log('welcome')
              handleLogin(data.content.user)
            }
            else if(localStorage.getItem('azerty') && localStorage.getItem('querty')){
              console.log("tu etais sauvegarder en local")
              webSocket.send(JSON.stringify({
                type: 'login',
                content:{
                  username: localStorage.getItem('azerty'),
                  password: localStorage.getItem('querty')
                }
              }))
            }
            else{
              console.log("vous are not connect")
              history.push('/login')
            }

          }
          if(data.type === "login"){
            console.log(data.content)
      
            if(data.status==="success"){
              console.log('welcome')
              handleLogin(data.content.user)
            }
            else{
              console.log("vous are not connect")
              localStorage.clear('azerty')
              localStorage.clear('querty')
              history.push('/login')
            }
          }
        }
      }
    }, [])

    let { from } = location.state || { from: { pathname: "/" } };
    const handleLogin = (user) => {
      auth.signin(() => {
        history.replace(from);
        return user
      });
    };

    return (
      <Route
        {...rest}>
          {isLoading 
            ? (
              <div>
                <LinearBuffer/>
              </div>
            )
            : auth.user 
              ? (<Component webSocket={webSocket}/>) 
              : ( <Redirect
                    to={{
                      pathname: "/login",
                      state: { from: location }
                    }}
                  />
                )
          }
          </Route>
    );
  }
  
  function PublicPage() {
    return <h3>Public</h3>;
  }
  
  function LoginPage() {
    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();
  
    let { from } = location.state || { from: { pathname: "/" } };
    let login = () => {
      auth.signin(() => {
        history.replace(from);
        return 'user'
      });
    };
  
    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={login}>Log in</button>
      </div>
    );
  } 