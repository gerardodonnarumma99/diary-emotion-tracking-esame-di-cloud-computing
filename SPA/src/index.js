import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";
import App from "./App.jsx";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import { RecoilRoot, useRecoilState } from "recoil";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FullScreenLoader from "./components/FullScreenLoader/FullScreenLoader";
import SnackbarCustom from "./components/SnackbarCustom/SnackbarCustom";
import ResponsiveAppBar from "./components/AppBar/ResponsiveAppBar";
import { themeAtom } from "./state/atom";
import { CssBaseline } from "@mui/material";

/**
 * Initialize a PublicClientApplication instance which is provided to the MsalProvider component
 * We recommend initializing this outside of your root component to ensure it is not re-initialized on re-renders
 */
const msalInstance = new PublicClientApplication(msalConfig);

/**
 * We recommend wrapping most or all of your components in the MsalProvider component. It's best to render the MsalProvider as close to the root as possible.
 */

const WrapperThemeProvider = () => {
    const [themeState, setThemeState] = useRecoilState(themeAtom)
    
    let theme = createTheme({
        palette: {
            backgroundColor: {
                default: "#f1f1f1"
              },
            primary: {
                main: themeState.primary
            },
            secondary: {
                main: themeState.secondary
            }
        },
        components: {
            MuiDrawer: {
              styleOverrides: {
                paper: {
                  backgroundColor: "#009be5",
                  color: "white",
                }
              }
            }
        },
        typography: {
            fontFamily: [
                "Kdam Thmor Pro",
                "sans-serif"
              ].join(","),
            fontSize: 12,
        }
    });
    
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <FullScreenLoader />
            <SnackbarCustom />
            <App />
        </ThemeProvider>
    )
}
ReactDOM.render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <RecoilRoot>
                <WrapperThemeProvider />
            </RecoilRoot>
        </MsalProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
