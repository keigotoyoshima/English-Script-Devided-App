import App from "./components/App";
import Theme from  "./components/theme/Theme";
import { ThemeProvider } from '@material-ui/core/styles';
import ReactDOM from 'react-dom'
import React from 'react'
import { UserContextProvider } from "./components/userContext/userContext";
import { DjangoApiContextProvider } from "./components/frontend_api/DjangoApi";
import { YoutubeIframeApiContextProvider } from "./components/frontend_api/YoutubeIframeApi";

ReactDOM.render(
  <ThemeProvider theme={Theme}>
    <UserContextProvider>
      <DjangoApiContextProvider>
        <YoutubeIframeApiContextProvider>
          <App />
        </YoutubeIframeApiContextProvider>
      </DjangoApiContextProvider>
    </UserContextProvider>
  </ThemeProvider>,
  document.getElementById('app')
);