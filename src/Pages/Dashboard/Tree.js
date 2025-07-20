import LineAxisIcon from '@mui/icons-material/LineAxis';
import GroupIcon from '@mui/icons-material/Group';
import CategoryIcon from '@mui/icons-material/Category';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { Image } from 'react-bootstrap';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

const MergeIcon = require('../../assets/images/merge.png');
const styleIconSideBar = {
    display: "block",
    width: "25px",
    height: "25px",
    objectFit: "cover",
    borderRadius: "15px",
    // #727272
    filter: "invert(45%) sepia(2%) saturate(50%) hue-rotate(314deg) brightness(96%) contrast(83%)",
}

export const NavLinks = [
    {
        to: "/dashboard/main",
        icon: <LineAxisIcon />,
        span: "Dashboard",
    }, {
        to: "/dashboard/users",
        icon: <GroupIcon />,
        span: "Users",
    }, {
        to: "/dashboard/createNewUser",
        icon: <AddCircleOutlineIcon />,
        span: "Add User",
    },
]

export const NavCategories = [
    {
        to: "/dashboard/categories/list",
        icon: < CategoryIcon />,
        span: "Categories",
    },
    {
        to: "/dashboard/categories/add",
        icon: < AddCircleOutlineIcon />,
        span: "Add Category",
    },
]

export const NavProducts = [
    {
        to: "/dashboard/products/list",
        icon: < FormatListNumberedIcon />,
        span: "List view",
    }
    , {
        to: "/dashboard/products/add",
        icon: < AddCircleOutlineIcon />,
        span: "Add products",
    }
]

export const NavSettings = [
    {
        to: "/dashboard/settings/homePage",
        icon: < SettingsIcon />,
        span: "Home page",
    },
    {
        to: "/dashboard/settings/carousel",
        icon: < ViewCarouselIcon />,
        span: "Top home page",
    },
    {
        to: "/dashboard/merges",
        icon: <Image color='text-warning' style={styleIconSideBar} src={MergeIcon} />,
        span: "Merges",
    },
    {
        to: "/dashboard/merges/add",
        icon: <Image color='text-warning' style={styleIconSideBar} src={MergeIcon} />,
        span: "Add",
    }
]


