import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TelegramIcon from '@mui/icons-material/Telegram';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    Avatar, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, Link, List,
    ListItem,
    ListSubheader, OutlinedInput, Paper, Typography, useTheme
} from "@mui/material";
import gsap from 'gsap';
import { TextPlugin } from 'gsap/dist/TextPlugin';
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import welcomeImg from "../assets/welcome.jpg";
import { snackbarAtom, usersAtom } from "../state/atom";
import UnauthenticatedPage from "./UnauthenticatedPage";

const AuthenticatedContainer = () => {
    const theme = useTheme();
    const user = useRecoilValue(usersAtom);
    const elementWelcomeText = useRef(null);
    const elementUserText = useRef(null);
    const [snackbar, setSnackbar] = useRecoilState(snackbarAtom);
    const [showToken, setShowToken] = useState(null);

    useEffect(() => {
        gsap.registerPlugin(TextPlugin);

        if(!user || !user.name) return;

        gsap.to(elementWelcomeText.current, {
            duration: 1,
            text: 'Welcome back,',
            ease: 'none',
            onComplete: () => {
                gsap.to(elementUserText.current, {
                    duration: 1,
                    text: `${user.name}`,
                    ease: 'none'
                });
            }
        });
    }, [user])

    const handleCopyTelegramCode = (e) => {
        if(!user || !user.confirmTelegramCode) {
            return setSnackbar({
                isOpen: true,
                message: "It was not possible to copy the token!",
                severity: "error"
            })
        }

        navigator.clipboard.writeText(user.confirmTelegramCode);

        return setSnackbar({
            isOpen: true,
            message: "Token copied!",
            severity: "success"
        })
    };

    const handleShowToken = (e) => {
        setShowToken((prevShowToken) => !prevShowToken)
    }

    return (
        <Container maxWidth="md" sx={{ marginTop: 5, marginBottom: 5 }}>
            <Paper 
                elevation={2} 
                style={{ 
                    backgroundImage: `linear-gradient(to right, #EA52, rgb(109 179 242 / 39%)), url(${welcomeImg})`,
                    backgroundSize: "cover",
                    height: 300,
                    padding: 30
                }}>
                <Typography 
                    ref={elementWelcomeText}
                    id="welcome_text"
                    color="primary" 
                    variant="h3"
                    style={{ textShadow: "rgb(255 255 255) 3px 2px 0px" }} />
                <Typography 
                    ref={elementUserText}
                    color="primary" 
                    variant="h3"
                    style={{ textShadow: "rgb(255 255 255) 3px 2px 0px" }} />
            </Paper>
            <Grid 
                container
                direction="row"
                justifyContent="start"
                alignItems="center"
                spacing={2} 
                style={{  marginTop: 15, marginBottom: 15 }} >
                    <Grid item xs={12} md={8} >
                    <Paper 
                        elevation={2} 
                        style={{ padding: 15 }}>
                    <Grid 
                        container
                        direction="row"
                        justifyContent="start"
                        alignItems="center"
                        spacing={2} 
                        style={{ marginBottom: 15 }} >
                        {user && user.id && (
                            <>
                            <Grid item xs={12} md={2}>
                                <Avatar sx={{ bgcolor: theme.palette.secondary.main }} alt={user.name}>
                                    {user.name.substring(0, 1)}
                                </Avatar>
                            </Grid>
                            <Grid item xs={12} md={10}>
                                <List>
                                    <ListItem disablePadding>
                                        <Typography>{`Name: ${user.name}`}</Typography>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <Typography>{`Surname: ${user.surname}`}</Typography>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <Typography>{`Email: ${user.email}`}</Typography>
                                    </ListItem>
                                </List>
                            </Grid>
                            </>
                        )}
                </Grid>
            </Paper>
                </Grid> 
                <Grid item xs={12} md={4}>
                    <Paper elevation={2}>
                        <List
                            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    Bot Telegram Configuration
                                </ListSubheader>
                            } >
                                <ListItem>
                                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                    <InputLabel htmlFor="adornment_token_telegram">Telegram Token</InputLabel>
                                    <OutlinedInput
                                        id="adornment_token_telegram"
                                        type={showToken ? "text" : "password"}
                                        value={user && user.confirmTelegramCode ? user.confirmTelegramCode : ""}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton edge="end" onClick={handleCopyTelegramCode}>
                                                    <ContentCopyIcon />
                                                </IconButton>
                                                <IconButton edge="end" onClick={handleShowToken}>
                                                    {showToken ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                        disabled
                                    />
                                    </FormControl>
                                </ListItem>
                                <ListItem style={{ justifyContent: "right" }}>
                                    <Link href="https://t.me/emotion_tracking_bot" underline="none">
                                        Vai al Bot <TelegramIcon />
                                    </Link>
                                </ListItem>
                        </List>
                    </Paper>
                </Grid> 
            </Grid>
        </Container>
    )
}

const Home = () => {
    
    return(
        <>
            <AuthenticatedTemplate>
                <AuthenticatedContainer />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <Container maxWidth="md" sx={{ marginTop: 15, marginBottom: 5 }}>
                    <UnauthenticatedPage />
                </Container>
            </UnauthenticatedTemplate>
        </>
    )
}

export default Home;