import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import { RiCloseLargeFill } from "react-icons/ri";
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IoLogoSnapchat, IoMdClose, IoMdCloseCircleOutline } from 'react-icons/io';
import axios from 'axios';
import { Card, CardContent } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
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
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function PrimarySearchAppBar({ searchfilter, filter, setSearchOptions, unreadnotifications, unreadchallenges, removenotification, challengeNotifications, showNotifications, setShowNotifications }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const [settingsopen, setSettingsopen] = useState(false);


  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);


  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    handleMenuClose();

    localStorage.removeItem("ccuid");
    localStorage.removeItem("ccusername");
    localStorage.removeItem("ccavatar");

    // setTimeout(() => {

    navigate("/login");
    // }, 1000)


  }

  const profilepg = () => {
    handleMenuClose();
    // const uid = localStorage.getItem("ccuid");
    const username = localStorage.getItem("ccusername");
    navigate("/home/profile/" + username);
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };




  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
      <MenuItem onClick={profilepg}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={16} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            CodeCombat
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              value={filter}
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => searchfilter(e.target.value)}
            />
          </Search>
          {!settingsopen ? <SettingsIcon className="relative cursor-pointer"
            onClick={() => {
              setSettingsopen(!settingsopen)
            }} /> : <RiCloseLargeFill className="relative cursor-pointer transform hover:rotate-180 transition-transform duration-1000 hover:scale-150" onClick={() => setSettingsopen(!settingsopen)} />}
          <br />
          {settingsopen && <div className="absolute top-12 left-96 bg-white text-gray-800 rounded-lg shadow-2xl p-4">
            <h2 className="text-lg font-semibold mb-4">Search Settings</h2>
            <div className="mb-2">
              <input type="checkbox" id="name" className="mr-2 cursor-pointer" />
              <label htmlFor="name" className='cursor-pointer' onChange={(e) => {
                setSearchOptions((searchOptions) => {
                  return { ...searchOptions, name: e.target.checked }
                })
              }}>Room name</label>
            </div>
            <div className="mb-2">
              <input type="checkbox" id="description" className="mr-2 cursor-pointer" />
              <label htmlFor="description" className='cursor-pointer'>Description</label>
            </div>
            <div className="mb-2">
              <input type="checkbox" id="CreatedBy" className="mr-2 cursor-pointer" />
              <label htmlFor="CreatedBy" className='cursor-pointer'>Created By</label>
            </div>
          </div>}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={unreadnotifications} color="error">
                {/* <div></div> */}
                <MailIcon className='-z-10' />
                {/* <IoLogoSnapchat/> */}
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={unreadchallenges} color="error" onClick={() => removenotification()}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
            {showNotifications && (
            <div className="absolute top-12 right-0 z-10 w-80 bg-gray-800 text-white rounded-lg shadow-lg">
              <div className="flex justify-between items-center p-4 bg-gray-900 rounded-t-lg">
                <h6 className="text-lg font-semibold">Notifications</h6>
                <button onClick={() => setShowNotifications(!showNotifications)} className="text-white">
                  <IoMdClose />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto p-4">
                {challengeNotifications.map((notification, index) => (
                  <div key={index} className="p-3 my-2 bg-gray-700 rounded-lg hover:bg-indigo-500 cursor-pointer transition-all">
                    <p className="text-sm">{notification.msg}</p>
                  </div>
                ))}
              </div>
            </div>
            )}

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}