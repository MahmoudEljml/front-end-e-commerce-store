import * as React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles';
import { NavLink } from "react-router-dom";
import CancelIcon from '@mui/icons-material/Cancel';
import { DashboardContext } from '../../Context/ContextDashboard';
import { NavCategories, NavLinks, NavProducts, NavSettings } from './Tree';

const drawerWidth = 240;
const maxWindowWidth = 700;



const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));





export default function Sidebar(props) {
  const { isWidthMoreThan700, handleDrawerClose, appBarHeight, open } = props;
  var appBarHeight_use = isWidthMoreThan700 && appBarHeight.current ? appBarHeight.current.clientHeight : 0;

  const contextDashboard = React.useContext(DashboardContext);
  const [selectedItem, setSelectedItem] = React.useState(contextDashboard.selectedItemSideBar);


  React.useEffect(() => {
    const path = window.location.pathname;
    contextDashboard.setPath(path);
  }, []);

  React.useEffect(() => {
    setSelectedItem(contextDashboard.selectedItemSideBar);
  }, [contextDashboard.selectedItemSideBar]);

  React.useEffect(() => {
    const path = window.location.pathname;
    contextDashboard.setPath(path);
  }, [selectedItem]);

  const drawer_sx = {
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      backgroundColor: "rgb(248, 248, 248)",
      height: `calc(100vh  - ${appBarHeight_use}px)`,
      width: drawerWidth,
      top: `${appBarHeight_use}px`,
      boxSizing: 'border-box',
    },
  }

  return (
    <>
      <Drawer
        sx={drawer_sx}
        variant={isWidthMoreThan700 ? "persistent" : "temporary"}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}

      >
        {!isWidthMoreThan700 && <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <CancelIcon />
          </IconButton>
        </DrawerHeader>}

        <List className='scrollbar-cus-css'>
          <CustomListItems customNav={NavLinks} selectedItem={selectedItem}
            setSelectedItem={setSelectedItem} navBeforeLength={0}
          />
          <Divider><Chip label="Categories" size="small" /></Divider>

          <CustomListItems customNav={NavCategories} selectedItem={selectedItem}
            setSelectedItem={setSelectedItem} navBeforeLength={NavLinks.length}
          />
          <Divider><Chip label="Products" size="small" /></Divider>
          <CustomListItems customNav={NavProducts} selectedItem={selectedItem}
            setSelectedItem={setSelectedItem} navBeforeLength={NavLinks.length + NavCategories.length}
          />

          <Divider><Chip label="Settings" size="small" /></Divider>
          <CustomListItems customNav={NavSettings} selectedItem={selectedItem}
            setSelectedItem={setSelectedItem} navBeforeLength={NavLinks.length + NavCategories.length + NavProducts.length}
          />
        </List>
      </Drawer>
    </>
  )
}


function CustomListItems(props) {
  const { customNav,
    selectedItem,
    setSelectedItem,
    navBeforeLength } = props;

  return (
    <>
      {
        customNav.map((key, index) => {
          index = index + navBeforeLength;
          return (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => setSelectedItem(index)}
                component={NavLink} to={key.to} selected={selectedItem === index}
                sx={{
                  margin: "7px",
                  borderRadius: "10px",
                  padding: "2px 10px",
                  '&.Mui-selected': {
                    color: 'blue',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon>
                  {key.icon}
                </ListItemIcon>
                <ListItemText primary={key.span} />
              </ListItemButton>
            </ListItem >
          )
        })
      }
    </>
  )
}
