import React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';

const StyledRoot = styled(AppBar)(() => ({
    boxShadow: 'none',
}));

const Header = () => {
    return (
        <StyledRoot>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    ลงทะเบียนรับการแจ้งเตือนร้านยาชุมชนอบอุ่น
                </Typography>
            </Toolbar>
        </StyledRoot>
    )
}
export default Header