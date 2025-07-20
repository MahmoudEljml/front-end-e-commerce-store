import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Badge, Button, Drawer, styled } from '@mui/material';
import { useEffect, useState } from "react";
import { Form, Link, Navigate, useLocation } from 'react-router-dom';
import Logout from '../Auth/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CurrentUserContext } from '../../Context/ContextCurrentUser';
import { useContext } from 'react';
import Cookie from 'cookie-universal';
import { CurrentUserCartContext } from '../../Context/ContextCurrentUserCart';
// import navigate
import { useNavigate } from 'react-router-dom';


import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { MergesContext } from '../../Context/ContextMerges';
import { CategoriesContext } from '../../Context/ContextCategories';
import { TreeView } from '@mui/x-tree-view';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import logo from '../../assets/images/logo.jpg';

export default function MenuAppBar() {
    const location = useLocation();
    // get last split
    const lastSplit = location.pathname.split('/').pop();


    const { merges } = useContext(MergesContext);
    const { categories } = useContext(CategoriesContext);

    const nav = useNavigate();
    const cookie = Cookie();
    const token = cookie.get("e-commerce");

    const currentUserContext = useContext(CurrentUserContext);
    const { user, isLoad } = currentUserContext;
    const currentUserCartContext = useContext(CurrentUserCartContext);
    const { isLoadCart, length } = currentUserCartContext;
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);


    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const allMerge = [];
    const [newCategoriesOutAllMerge, setNewCategoriesOutAllMerge] = useState([]);


    useEffect(() => {
        merges.map((val) => {
            const b = val.merge;
            b.map((val) => {
                allMerge.push(val)
            })

        })

        setNewCategoriesOutAllMerge(categories.filter((category) => !allMerge.includes(category.id)))


    }, [categories])


    const treeData = merges.map((val, index) => {
        const id = val.id;
        const packageName = val.package_name;
        const mergeStr = val.merge;
        const merge = [];
        categories.map(val => {
            if (mergeStr.includes(val.id)) {
                merge.push(val)
            }
        })
        return (
            <TreeItem key={index} itemId={"g-" + index} label={packageName}
                slots={{
                    expandIcon: KeyboardArrowLeftIcon,
                    collapseIcon: KeyboardArrowDownIcon,
                }}
            >
                {
                    merge.map((item, index1) => {
                        return (
                            <TreeItem
                                sx={selectTreeItemStyle(item) || {}}
                                key={index1} itemId={"g-" + index1 + index} label={item.title}
                                onClick={() => {
                                    nav(`/categories/${item.id}`);
                                    // setOpen(false)
                                }}
                            />
                        );
                    })
                }

            </TreeItem>
        );

    });

    function selectTreeItemStyle(val) {
        return lastSplit == val.id && {
            backgroundColor: "rgba(131, 131, 131, 0.3)",
        }
    }

    const treeDataCategories = newCategoriesOutAllMerge.map((val, index) => {
        return (
            <StyledTreeItem
                sx={selectTreeItemStyle(val) || {}}
                key={index} itemId={"c-" + index} label={val.title} onClick={() => {
                    nav(`/categories/${val.id}`);
                }} />
        );
    })

    // change logo when scroll down 
    const handleScroll = () => {
        const logoElement = document.getElementsByClassName("logo-site")[0];
        if (logoElement) {
            if (window.scrollY > 0) {
                logoElement.classList.add("scroll-down");
            } else {
                logoElement.classList.remove("scroll-down");
            }
        }
    }
    window.addEventListener('scroll', handleScroll);

    return (
        <>
            <Box sx={{
                flexGrow: 1, position: "fixed",
                top: 0, left: 0, right: 0, zIndex: 100,
                height: "30px",
            }} >
                <AppBar position="static" sx={{ backgroundColor: "#58206b", }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            <img className='logo-site' src={require('../../assets/images/logo.jpg')} onClick={() => nav('/')} />
                        </Typography>
                        {user.length !== 0 && (
                            <div>
                                <Badge
                                    anchorOrigin={{ vertical: 'top', horizontal: 'left', }}
                                    sx={{ marginX: "10px", "& .MuiBadge-badge": { fontSize: "12px", color: "black", fontWeight: "bold", backgroundColor: "rgba(255, 255, 255, 0.15)" } }}
                                    
                                    badgeContent={!isLoadCart && length !== 0 ? length : null}
                                >
                                    <IconButton
                                        sx={{
                                            width: "35px", height: "35px", backgroundColor: "rgba(0, 0, 0, 0.1)",
                                            fontSize: "22px", fontWeight: "600", color: "white", '&:hover': { backgroundColor: "rgba(0, 0, 0, 0.2)", }
                                        }}
                                        onClick={() => {
                                            nav('/cart')
                                        }}
                                    >
                                        <ShoppingCartIcon sx={{ width: "20px", height: "20px" }} />
                                    </IconButton>
                                </Badge>

                                <IconButton
                                    sx={{ width: "35px", height: "35px", backgroundColor: "rgba(0, 0, 0, 0.1)", fontSize: "22px", fontWeight: "600", '&:hover': { backgroundColor: "rgba(0, 0, 0, 0.2)", } }}
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    {!isLoad && user.length !== 0 && user.name.slice(0, 1).toUpperCase()}
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                                    keepMounted
                                    transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    {["Admin", "Data entry"].includes(user.role) &&
                                        <MenuItem component={Link} to="/dashboard" >Dashboard</MenuItem>
                                    }
                                    <MenuItem >Profile</MenuItem>
                                    <MenuItem onClick={() => {
                                        handleClose();
                                        Logout();
                                    }}>Logout</MenuItem>
                                </Menu>
                            </div>
                        )}

                        {!isLoad && user.length == 0 &&
                            <>
                                <Button component={Link} to="/register" style={{ textTransform: 'none' }} color="inherit">Register</Button>
                                <Button component={Link} to="/login" style={{ textTransform: 'none' }} color="inherit">Login</Button>
                            </>
                        }
                    </Toolbar>
                </AppBar>

                <div>
                    <div >
                        <Drawer dir='rtl'
                            sx={drawer_sx}
                            variant={"temporary"}
                            anchor="left"
                            open={open}
                            onClose={handleDrawerClose}
                        >
                            <Box sx={{ minHeight: 352, minWidth: 250 }}>
                                <TreeView>
                                    {treeData}
                                    {treeDataCategories}
                                </TreeView>
                            </Box>
                        </Drawer>


                    </div>
                </div>
            </Box>



        </>
    );
}
const drawer_sx = {
    width: "250px",
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        backgroundColor: "rgb(248, 248, 248)",
        height: `calc(100vh  - ${0}px)`,
        width: "270px",
        top: `${0}px`,
        boxSizing: 'border-box',
    },
}

const StyledTreeView = styled(TreeView)`
  .MuiTreeItem-group {
    margin-left: 0;
  }
`;

const StyledTreeItem = styled(TreeItem)`
  .MuiTreeItem-iconContainer {
    display: none;
  }
     .MuiTreeItem-label {
    padding-left: 10px;
    padding-right: 10px;
  }
`;