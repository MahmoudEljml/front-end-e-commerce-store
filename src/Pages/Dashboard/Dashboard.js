import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import './DashboardStyle.css'
import Button from '@mui/material/Button';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Sidebar from './Sidebar';
import MenuIcon from '@mui/icons-material/Menu';
import { DashboardContext } from '../../Context/ContextDashboard';


const drawerWidth = 240;
const maxWindowWidth = 700;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function Dashboard() {

    const [open, setOpen] = React.useState(false);
    const appBarHeight = React.useRef(null);

    const [isWidthMoreThan700, setIsWidthMoreThan700] = useState(true);
    const contextDashboard = React.useContext(DashboardContext);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        if (!isWidthMoreThan700) {
            handleDrawerClose();
        }
    }, [contextDashboard.selectedItemSideBar])

    React.useEffect(() => {
        checkWindowWidth();
    }, [])
    window.addEventListener('resize', () => checkWindowWidth())

    function checkWindowWidth() {
        if (window.innerWidth > maxWindowWidth) {
            handleDrawerOpen();
            setIsWidthMoreThan700(true);
        } else {
            handleDrawerClose();
            setIsWidthMoreThan700(false);
        }
    }
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <CustomAppBar appBarHeight={appBarHeight} handleDrawerOpen={handleDrawerOpen} open={open} />

            <Sidebar
                isWidthMoreThan700={isWidthMoreThan700}
                handleDrawerClose={handleDrawerClose}
                appBarHeight={appBarHeight}
                open={open}
            />
            <CustomOutlet />
        </Box >
    );
}

function CustomAppBar(props) {
    const nav = useNavigate();

    const { appBarHeight, handleDrawerOpen, open } = props;
    return (
        <AppBar ref={appBarHeight} position="fixed" >
            <Toolbar className="d-flex justify-content-between">
                <div className='d-flex align-items-center'>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        E-commerce
                    </Typography>
                </div>
                <Button onClick={() => {
                    // nav('/');
                    window.location = "/";
                }} sx={{
                    color: "white",
                    textTransform: 'none'
                }}>
                    <KeyboardDoubleArrowLeftIcon />Home Page
                </Button>
            </Toolbar>
        </AppBar >
    )
}


function CustomOutlet() {
    return (
        <Main open={true} style={{
            height: "100vh"
        }}>
            <DrawerHeader />
            <Typography paragraph>
                <Outlet />
            </Typography>
        </Main>
    )
}

