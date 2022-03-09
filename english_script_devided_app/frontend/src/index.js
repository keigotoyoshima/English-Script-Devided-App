// import AppNavber from "./components/AppNavbar";
import App from "./components/App";
import Theme from  "./components/theme/Theme";
import { ThemeProvider } from '@material-ui/core/styles';
import ReactDOM from 'react-dom'
import React from 'react'
import { UserContextProvider } from "./components/userContext/userContext";

ReactDOM.render(
  <ThemeProvider theme={Theme}>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </ThemeProvider>,
  document.getElementById('app')
);