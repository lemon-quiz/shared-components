import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#546e7a',
    },
    secondary: {
      main: '#bf360c',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#efefef',
    },
  },
});

export default theme;
