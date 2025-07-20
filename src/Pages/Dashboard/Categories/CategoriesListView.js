import * as React from 'react';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthorizatioN, BASEURL, CAT, DELETE_CAT, USER, USERS } from "../../../Api/Api";
import Cookie from 'cookie-universal';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DeleteIcon from '@mui/icons-material/Delete';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export default function Categories() {
    const nav = useNavigate();
    const cookie = Cookie();
    const [categories, setCategories] = useState([]);
    const [startSlice, setStartSlice] = useState(0);
    const [endSlice, setEndSlice] = useState(5);
    const [numOfRows, setNumOfRow] = useState(5);


    useEffect(() => {
        try {
            const fetchUsers = async () => {
                await axios.get(`${BASEURL}/${CAT}`,
                    AuthorizatioN(cookie.get("e-commerce")))
                    .then((data) => setCategories(data.data))
            }
            fetchUsers();
        } catch (error) {
            console.log("error  " + error.response.data)
        }
    }, []);

    function deleteUsers(id) {
        const fetchUsers = async () => {
            await axios.delete(`${BASEURL}/${DELETE_CAT}/${id}`,
                AuthorizatioN(cookie.get("e-commerce")))
                .then(setCategories((prev) => prev.filter((item) => item.id !== id)));
        }
        fetchUsers();
    }

    function handelChangePagination(value) {
        setStartSlice((value - 1) * numOfRows);
        setEndSlice((value - 1) * numOfRows + numOfRows);
    }

    function handelChangeNumOfRow(event) {
        setNumOfRow(event.target.value);
        setStartSlice(0);
        setEndSlice(event.target.value);
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer className="scrollbar-cus-css" component={Paper} sx={{
                maxHeight: 440,
                minHeight: 440
            }}>
                <Table stickyHeader aria-label="sticky table" dir="rtl">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories
                            .slice(startSlice, endSlice)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.id === 'image'
                                                        ? <img height={60} src={value} />
                                                        : column.id === 'action'
                                                            ? <>
                                                                <IconButton onClick={() => nav(`/dashboard/categories/list/${row.id}`)} >
                                                                    <EditCalendarIcon />
                                                                </IconButton>
                                                                <IconButton onClick={() => deleteUsers(row.id)}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </>
                                                            : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <div className="d-flex align-items-center ">
                <Stack spacing={2}>
                    <Pagination count={parseInt(categories.length / numOfRows) + 1} color="primary"
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
    );

}

const columns = [
    { id: 'id', label: 'Id', minWidth: 70, align: 'center', },
    { id: 'title', label: 'Title', minWidth: 100, align: 'center', },
    { id: 'image', label: 'Image', minWidth: 170, align: 'center', },
    { id: 'action', label: 'Action', minWidth: 170, align: 'center', },
];



{/* <TablePagination
                sx={{
                    "& p": {
                        margin: "auto"
                    }
                }}
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={categories.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}