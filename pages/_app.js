import '../styles/globals.css';

import { CssBaseline, ThemeProvider } from '@material-ui/core';

import theme from '../theme/public';

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>

  );
}

export default MyApp;
