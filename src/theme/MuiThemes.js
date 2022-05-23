import { createMuiTheme } from '@material-ui/core/styles';

export const mainTheme = createMuiTheme({
  palette: {
    secondary: {
      main: '#ffca28',
      light: '#ffd453',
      dark: '#b28d1c',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    error: {
      main: '#FF5640',
      light: '#e57373',
      dark: '#d32f2f',
    },
  },
});

export const serviceTheme = createMuiTheme({
  palette: {
    secondary: {
      main: '#ffca28',
      light: '#ffd453',
      dark: '#b28d1c',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    primary: {
      main: '#2196f3',
      // main: '#0018c2',
      light: '#6576F6',
      dark: '#0C24D4',
    },
    error: {
      main: '#FF5640',
      light: '#e57373',
      dark: '#d32f2f',
    },
  },
});
