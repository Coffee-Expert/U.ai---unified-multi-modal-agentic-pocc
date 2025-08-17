// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Light Blue
    },
    secondary: {
      main: '#f48fb1', // Pink
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Arial", sans-serif',
    allVariants: {
      color: '#ffffff',
    },
  },
  palette: {
    mode: 'dark',
    primary: { main: '#7c4dff' },
    secondary: { main: '#ff4081' },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  }
  
});

export default theme;
