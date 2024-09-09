import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: '"TamaConnectType", "Aperçu", Sans-Serif',
    h1: {
      fontFamily: '"TamaConnectType", sans-serif',
      fontWeight: 'normal', 
    },
    h2: {
      fontFamily: '"TamaConnectType", sans-serif',
      fontWeight: 'normal',
    },
    body1: {
      fontFamily: '"Aperçu", sans-serif',
      fontWeight: 'normal',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Aperçu", sans-serif', 
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
