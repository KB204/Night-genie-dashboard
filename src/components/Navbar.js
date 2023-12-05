import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/system';
import { logout } from './authService';

const LogoutButton = styled(IconButton)({
  position: 'absolute',
  top: 15,
  right: 40,
});

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" style={{ marginBottom: '16px' }}>
      <Toolbar>
        <LogoutButton color="inherit" onClick={handleLogout}>
          <LogoutIcon />
        </LogoutButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Night Genie Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
