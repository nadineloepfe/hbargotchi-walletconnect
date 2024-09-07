import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: '"TamaConnectType", "Helvetica Neue", Sans-Serif',
    h1: {
      fontFamily: '"TamaConnectType", sans-serif',
      fontWeight: 'normal', 
    },
    h2: {
      fontFamily: '"TamaConnectType", sans-serif',
      fontWeight: 'normal',
    },
    body1: {
      fontFamily: '"Styrene A Web", sans-serif',
      fontWeight: 'normal',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Styrene A Web", sans-serif', 
          fontWeight: 'bold', 
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#8259ef'
    }
  }
});
