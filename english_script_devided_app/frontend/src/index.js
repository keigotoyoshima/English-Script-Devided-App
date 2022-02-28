// import AppNavber from "./components/AppNavbar";
import App from "./components/App";
import Theme from  "./components/theme/Theme";
import { ThemeProvider } from '@material-ui/core/styles';
import ReactDOM from 'react-dom'
import React from 'react'

ReactDOM.render(
  <ThemeProvider theme={Theme}>
  <App />
  </ThemeProvider>,
  document.getElementById('app')
);