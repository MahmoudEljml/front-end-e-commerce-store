import * as React from 'react';
import { AuthorizatioN, BASEURL, CAT, DELETE_CAT, PRODUCTS, PRODUCT, USER, USERS } from "../../../Api/Api";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookie from 'cookie-universal';
import { CategoriesContext } from '../../../Context/ContextCategories';
import moment from 'moment';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import IconButton from '@mui/material/IconButton';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';


import { Button } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material";
import { Alert } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { ProductsContext } from '../../../Context/ContextProducts';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductsListView() {
    const productsContext = React.useContext(ProductsContext);

    const cookie = Cookie();
    const [products, setProducts] = useState([]);

    const [productDelete, setProductDelete] = useState([]);
    const [open, setOpen] = useState(false);

    const [openTitle, setOpenTitle] = useState();

    useEffect(() => {
        // setProducts(productsContext.products);
        try {
            const fetchUsers = async () => {
                await axios.get(`${BASEURL}/${PRODUCTS}`,
                    AuthorizatioN(cookie.get("e-commerce")))
                    .then((data) => setProducts(data.data));
                // console.log(products[0].images[0].image)
            }
            fetchUsers();
        } catch (error) {
            console.log("error  " + error.response.data)
        }
    }, []);


    function deleteUsers(row) {
        setProductDelete(row);
        setOpen(true);
    }

    useEffect(() => {
        products.map((val) => setOpenTitle((prevOpenTitle) => ({ ...prevOpenTitle, [val.id]: false })))
        console.log(products)
    }, [products])


    return (
        <div>
            <StickyHeadTable data={products} deleteUsers={deleteUsers}
                openTitle={openTitle} setOpenTitle={setOpenTitle}
            />
            {/* */}
            <AlertDeleteDialog
                open={open} setOpen={setOpen}
                productDelete={productDelete}
                products={products}
                setProducts={setProducts}
                cookie={cookie} />
        </div>
    );
}

function StickyHeadTable({ data, deleteUsers, openTitle, setOpenTitle }) {
    const [startSlice, setStartSlice] = useState(0);
    const [endSlice, setEndSlice] = useState(5);
    const [numOfRows, setNumOfRow] = useState(5);
    function handelChangePagination(value) {
        setStartSlice((value - 1) * numOfRows);
        setEndSlice((value - 1) * numOfRows + numOfRows);
    }

    function handelChangeNumOfRow(event) {
        setNumOfRow(event.target.value);
        setStartSlice(0);
        setEndSlice(event.target.value);
    }

    const rows = data;

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer className="scrollbar-cus-css" component={Paper} sx={{
                maxHeight: 440,
                minHeight: 440
            }}>
                <Table stickyHeader aria-label="sticky table" dir="rtl">
                    <TableHead>
                        <TableRow >
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(startSlice, endSlice)
                            .map((row) => {
                                return <Row row={row} deleteUsers={deleteUsers} openTitle={openTitle} setOpenTitle={setOpenTitle} />
                            })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <div className="d-flex align-items-center ">
                <Stack spacing={2}>
                    <Pagination count={parseInt(data.length / numOfRows) + 1} color="primary"
                        onChange={(event, value) => handelChangePagination(value)} />
                </Stack>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-standard-label">number of rows</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={numOfRows}
                        onChange={(event) => handelChangeNumOfRow(event)}
                        label="Age"
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </Paper >
    )
}


function Row(props) {
    const categoriesContext = React.useContext(CategoriesContext);
    const { categories } = categoriesContext;

    const { row, deleteUsers, openTitle, setOpenTitle } = props;

    return (
        <React.Fragment key={row.id}>
            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                {columns.map((column) => {
                    const value = row[column.id];
                    return (
                        <TableCell key={column.id} align={column.align}>
                            {PrintCell(row, column, openTitle, setOpenTitle, deleteUsers, value, categories)}
                        </TableCell>
                    );
                })}

            </TableRow >
            <TableRow >
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "#eeeeee" }} colSpan={6}>
                    <Collapse in={openTitle && openTitle[row.id]} timeout="auto" unmountOnExit >

                        <Box sx={{ margin: 1 }}>
                            <Typography gutterBottom component="p"
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                }}
                            >
                                Details
                            </Typography>
                            <Typography gutterBottom component="div">
                                <div className=" div-details-products">
                                    <div>
                                        <Table sx={{
                                            maxWidth: 450,
                                        }}>
                                            <TableBody>
                                                {cusTableRow("category", categories.map((category, index) => {
                                                    if (category.id === row.category) {
                                                        return category.title
                                                    }
                                                }))}
                                                {cusTableRow("description", row.description)}
                                                {cusTableRow("rating", row.rating)}
                                                {cusTableRow("price", row.price)}
                                                {cusTableRow("discount", row.discount)}
                                                {cusTableRow("About", row.About)}
                                                {cusTableRow("created at", moment(row.created_at).format('YYYY-MM-DD'))}
                                                {cusTableRow("updated at", moment(row.updated_at).format('YYYY-MM-DD'))}

                                            </TableBody>
                                        </Table>
                                    </div>
                                    {/* swiper images */}
                                    {/* <div className="div-swiper-products">
                                        <Swiper
                                            effect={'cards'}
                                            grabCursor={true}
                                            modules={[EffectCards]}
                                            className="mySwiper swiper"
                                        >
                                            {row.images.map((item, index) => {
                                                console.log(item)
                                                return (
                                                    <SwiperSlide className="swiper-slide" key={index}>
                                                        <img className="img" src={item.image} alt="Swiper image" />
                                                    </SwiperSlide>
                                                )
                                            })}
                                        </Swiper>
                                    </div> */}
                                </div>
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment >
    );
}

function PrintCell(row, column, openTitle, setOpenTitle, deleteUsers, value, categories) {
    const nav = useNavigate();

    if (column.id === 'collapse') {
        return (
            <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpenTitle({ ...openTitle, [row.id]: !openTitle[row.id] })}
            >
                {openTitle && openTitle[row.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
        )
    } else if (column.id === 'image') {
        return <img height={60} src={value} />
    } else if (column.id === 'category') {
        return (
            categories.map((category, index) => {
                if (category.id === row.category) {
                    return category.title
                }
            })
        )
    } else if (column.id === 'action') {
        return (
            <>
                <IconButton onClick={() => nav(`/dashboard/products/list/${row.id}`)} >
                    <EditCalendarIcon />
                </IconButton>
                <IconButton onClick={() => {
                    deleteUsers(row);
                }}>
                    <DeleteIcon />
                </IconButton>
            </>
        )
    } else {
        return value
    }
}

function cusTableRow(title, value) {
    return (
        <TableRow sx={{

            '& .MuiTableCell-root': {
                padding: '2px',
                fontSize: 12
            },
        }} hover>
            <TableCell sx={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                {title === "About" ? (
                    <textarea rows={4} cols={30} value={value} readOnly style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        resize: 'none', // optional, to prevent resizing
                    }} />
                ) : (
                    value
                )}
            </TableCell>
            <TableCell>{title}</TableCell>

        </TableRow>
    )
}

function AlertDeleteDialog(props) {
    const { open, setOpen, productDelete, products, setProducts, cookie } = props;
    const [loading, setLoading] = React.useState(false);
    const [emailIsAvailable, setEmailIsAvailable] = React.useState("hidden");
    const [txtErrorRes, setTxtErrorRes] = React.useState("");
    const { categories } = React.useContext(CategoriesContext);

    const handleClose = () => {
        setOpen(false);
        setEmailIsAvailable("hidden")
    };


    const onSubmitEditUser = async () => {
        setLoading(true);

        const fetchUsers = async () => {
            await axios.delete(`${BASEURL}/${PRODUCT}/${productDelete.id}`,
                AuthorizatioN(cookie.get("e-commerce")))
                .then((res) => {
                    setProducts(products.filter(val => val.id !== productDelete.id));
                    setLoading(false);
                    setOpen(false);
                })
                .catch((error) => {
                    if (error.response.data.message.length > 0) {
                        setTxtErrorRes(error.response.data.message);
                        setEmailIsAvailable("visibility");
                        setTimeout(() => {
                            setEmailIsAvailable("hidden");
                        }, 4000);
                        console.log(error.response.data.message)
                    } else {
                        console.log("error users page: " + error)
                    }
                    setLoading(false);
                });
        }
        fetchUsers();

    };



    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-title">{"delete this product ?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description" >
                        <div className='d-flex flex-column'>
                            <Box sx={{ minWidth: 120 }}>
                                <Table sx={{
                                    maxWidth: 450,
                                }}>
                                    <TableBody>
                                        {cusTableRow("id", productDelete.id)}
                                        {cusTableRow("category", categories.map((category, index) => {
                                            if (category.id === productDelete.category) {
                                                return category.title
                                            }
                                        }))}
                                        {cusTableRow("description", productDelete.description)}
                                        {cusTableRow("rating", productDelete.rating)}
                                        {cusTableRow("price", productDelete.price)}
                                        {cusTableRow("discount", productDelete.discount)}
                                        {cusTableRow("About", productDelete.About)}
                                        {cusTableRow("created at", moment(productDelete.created_at).format('YYYY-MM-DD'))}
                                        {cusTableRow("updated at", moment(productDelete.updated_at).format('YYYY-MM-DD'))}

                                    </TableBody>
                                </Table>
                            </Box>
                            <Alert sx={{ visibility: emailIsAvailable }} severity="warning">{txtErrorRes}</Alert>
                        </div>
                    </DialogContentText>
                </DialogContent>

                <DialogActions >
                    <Button onClick={handleClose} sx={{
                        textTransform: 'none'
                    }}>Disagree</Button>
                    <LoadingButton
                        autoFocus
                        endIcon={<SendIcon />}
                        loading={loading}
                        loadingPosition="end"
                        variant="text"
                        onClick={onSubmitEditUser}
                        sx={{
                            textTransform: 'none'
                        }}
                    >
                        Agree
                    </LoadingButton>
                </DialogActions>
            </Dialog >
        </React.Fragment>
    )
}



const columns = [
    { id: 'collapse', label: '', minWidth: 50, align: 'left', },
    { id: 'id', label: 'Id', minWidth: 170, align: 'left', },
    { id: 'title', label: 'Title', minWidth: 100, align: 'left', },
    { id: 'category', label: 'Category', minWidth: 100, align: 'left', },
    // {id: 'image', label: 'Image', minWidth: 170, align: 'center', },
    { id: 'action', label: 'Action', minWidth: 170, align: 'center', },
];


