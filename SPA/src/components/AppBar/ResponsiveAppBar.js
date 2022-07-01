import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import MenuIcon from '@mui/icons-material/Menu';
import { Divider } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/system';
import { gsap } from "gsap";
import { useLayoutEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { loginRequest } from '../../authConfig';
import { usersAtom } from '../../state/atom';
import itemsMenu from './itemsMenu';

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { instance } = useMsal();
  const [user, setUser] = useRecoilState(usersAtom);
  const navigate = useNavigate();
  const theme = useTheme();
  const [el, setEl] = useState(null);

  useLayoutEffect(() => {
    if (!el) return;
    gsap.from(el, {
      duration: 3,
      rotation: 360
    });
  }, [el]);

  const handleSignIn = (loginType) => {
      if (loginType === "popup") {
          instance.loginPopup(loginRequest).catch(e => {
              console.log(e);
          });
      } else if (loginType === "redirect") {
          instance.loginRedirect(loginRequest).catch(e => {
              console.log(e);
          });
      }
  }

  const handleSignOut = (logoutType) => {
    if (logoutType === "popup") {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        });
    } else if (logoutType === "redirect") {
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });
    }
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <FaceRetouchingNaturalIcon 
            sx={{
               display: { xs: 'none', md: 'flex' }, 
               mr: 1,
               filter: 'drop-shadow(0px 3px 3px #00000066)',
               color: 'white'
            }} />
          <Typography
            ref={setEl}
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'white',
              textShadow: '2px 2px #00000066',
            }}
          >
            Emotion Tracking
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                <AuthenticatedTemplate>
                    {itemsMenu.map(({ text, icon, path }) => (
                        <MenuItem key={text} onClick={handleCloseNavMenu} >
                            <Typography textAlign="center" component={Link} to={path}>{text}</Typography>
                        </MenuItem>
                    ))}
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <MenuItem onClick={() => handleSignIn("popup")}>Sign In</MenuItem>
                </UnauthenticatedTemplate>
            </Menu>
          </Box>
          <FaceRetouchingNaturalIcon 
            sx={{
              display: { xs: 'flex', md: 'none' }, 
              mr: 1,  
              filter: 'drop-shadow(0px 3px 3px #00000066)',
              color: 'white' 
            }} />
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'white',
              textShadow: '2px 2px #00000066',
            }}
          >
            Emotion Tracking
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <AuthenticatedTemplate>
                  {itemsMenu.map(({ text, icon, path }) => (
                        <MenuItem
                            key={text}
                            onClick={() => {
                              navigate(path);
                              handleCloseNavMenu();
                            }}
                            sx={{ color: 'white', display: 'block' }} >
                            {text}
                        </MenuItem>
                    ))}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                  <MenuItem key={"signin"} onClick={() => handleSignIn("popup")}>Sign In</MenuItem>
            </UnauthenticatedTemplate>
          </Box>

            <AuthenticatedTemplate>
                {user && user.id && 
                  (<Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Info Account">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar sx={{ bgcolor: theme.palette.secondary.main }} alt={user.name}>{user.name.substring(0, 1)}</Avatar>
                    </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                        <MenuItem key={user.name}>
                          <Typography textAlign="center">{user.name}</Typography>
                        </MenuItem>
                        <MenuItem key={user.surname}>
                          <Typography textAlign="center">{user.surname}</Typography>
                        </MenuItem>
                        <MenuItem key={user.email}>
                          <Typography textAlign="center">{user.email}</Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => handleSignOut("popup")}>
                          <Typography textAlign="center">Sign Out</Typography>
                        </MenuItem>
                    </Menu>
                </Box>)}
            </AuthenticatedTemplate>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
