import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  Divider, 
  IconButton, 
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  InputBase,
  Badge,
  useMediaQuery,
  useTheme,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ListAlt as ListAltIcon,
  Assignment as AssignmentIcon,
  Calculate as CalculateIcon,
  ChevronLeft as ChevronLeftIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  LightMode as LightModeIcon,
  NightsStay as DarkModeIcon,
  DirectionsBoat as BoatIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    }),
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      padding: theme.spacing(2),
    },
  }),
);

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  zIndex: theme.zIndex.drawer + 1,
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: 0,
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  minHeight: 64,
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: '100%',
  maxWidth: '400px',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '0.875rem',
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.default,
    border: 'none',
  },
}));

const NavSection = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const NavSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
  padding: theme.spacing(0, 2),
  marginBottom: theme.spacing(1),
}));

const LogoContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const LogoIcon = styled(BoatIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '2rem',
}));

export default function Layout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Auto-close drawer on mobile
  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // Navigation items with sections
  const navigationItems = [
    {
      section: 'Główne',
      items: [
        { text: 'Pulpit', icon: <DashboardIcon />, path: '/' },
      ]
    },
    {
      section: 'Zarządzanie Produkcją',
      items: [
        { text: 'Produkty', icon: <InventoryIcon />, path: '/products' },
        { text: 'Listy BOM', icon: <ListAltIcon />, path: '/boms' },
        { text: 'Zamówienia', icon: <AssignmentIcon />, path: '/orders' },
        { text: 'Zapotrzebowanie MRP', icon: <CalculateIcon />, path: '/material-requirements' },
      ]
    }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar position="fixed" open={open} color="inherit">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }), display: { xs: 'block', md: open ? 'none' : 'block' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo on Mobile */}
          {isMobile && (
            <LogoContainer sx={{ flexGrow: 1 }}>
              <LogoIcon />
              <Typography variant="h6" noWrap component="div" fontWeight="bold">
                BoatMRP
              </Typography>
            </LogoContainer>
          )}

          {/* Search Bar */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Szukaj produktów, zamówień..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />
          
          {currentUser && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Notifications */}
              <Tooltip title="Powiadomienia">
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleNotificationMenu}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Menu
                id="notification-menu"
                anchorEl={notificationAnchorEl}
                keepMounted
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationClose}
                PaperProps={{
                  sx: { width: 320, maxHeight: 500, mt: 1.5 },
                }}
              >
                <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="h6">Powiadomienia</Typography>
                </Box>
                <MenuItem onClick={handleNotificationClose}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2">Nowe zamówienie #1234</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Nowe zamówienie wymaga potwierdzenia
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      5 minut temu
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2">Niski stan magazynowy</Typography>
                    <Typography variant="body2" color="text.secondary">
                      3 produkty wymagają uzupełnienia
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      2 godziny temu
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2">Zaktualizowano BOM</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lista BOM "Łódź Model X" została zaktualizowana
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      wczoraj
                    </Typography>
                  </Box>
                </MenuItem>
                <Box sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="body2" color="primary">
                    Zobacz wszystkie powiadomienia
                  </Typography>
                </Box>
              </Menu>

              {/* Theme Toggle - Placeholder for future functionality */}
              <Tooltip title="Zmień motyw">
                <IconButton color="inherit" sx={{ ml: 1 }}>
                  <LightModeIcon />
                </IconButton>
              </Tooltip>

              {/* User Menu */}
              <Tooltip title="Ustawienia konta">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: theme.palette.primary.main,
                      fontSize: '0.875rem'
                    }}
                  >
                    {currentUser.first_name ? currentUser.first_name.charAt(0) : 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: { width: 220, mt: 1.5 },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {currentUser.first_name} {currentUser.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentUser.email}
                  </Typography>
                  <Chip
                    size="small"
                    label={currentUser.department || "Administracja"}
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Divider />
                <MenuItem onClick={handleClose}>
                  <ListItemText primary="Mój profil" />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemText primary="Ustawienia" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemText primary="Wyloguj" />
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>
      
      <StyledDrawer
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <LogoContainer>
            <LogoIcon />
            <Typography variant="h6" fontWeight="bold">
              BoatMRP
            </Typography>
          </LogoContainer>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        
        <Box sx={{ overflowY: 'auto', px: 1 }}>
          {navigationItems.map((section) => (
            <NavSection key={section.section}>
              <NavSectionTitle>
                {section.section}
              </NavSectionTitle>
              <List>
                {section.items.map((item) => {
                  const isSelected = location.pathname === item.path;
                  return (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton 
                        onClick={() => navigate(item.path)}
                        selected={isSelected}
                        sx={{
                          borderRadius: '8px',
                          mb: 0.5,
                          '&.Mui-selected': {
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'primary.dark',
                            },
                            '& .MuiListItemIcon-root': {
                              color: 'white',
                            },
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.text} 
                          primaryTypographyProps={{ 
                            fontSize: '0.9375rem', 
                            fontWeight: isSelected ? 600 : 500 
                          }} 
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </NavSection>
          ))}
        </Box>
        
        {/* Bottom content - version info */}
        <Box sx={{ 
          mt: 'auto', 
          p: 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.grey[50]
        }}>
          <Typography variant="caption" color="text.secondary" display="block" align="center">
            BoatMRP System v1.2.0
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" align="center">
            &copy; 2025 BoatMRP Inc.
          </Typography>
        </Box>
      </StyledDrawer>
      
      <Main open={open}>
        <Toolbar />
        <Outlet />
      </Main>
    </Box>
  );
}
