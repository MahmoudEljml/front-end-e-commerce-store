import * as React from 'react';
import axios from "axios";
import Cookie from 'cookie-universal';
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthorizatioN, BASEURL, USER, USER_EDIT, USERS } from "../../../Api/Api";
import { CurrentUserContext } from '../../../Context/ContextCurrentUser';
import '../../../../src/index.css';
import { Button, TextField, Paper, InputBase, IconButton, Box } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material";
import { InputLabel, MenuItem, FormControl, Select, Alert, TableSortLabel, LinearProgress } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import SendIcon from '@mui/icons-material/Send';
import { TramOutlined } from "@mui/icons-material";
import LoadingButton from '@mui/lab/LoadingButton';
import { UsersContext } from '../../../Context/ContextUsers';

const header = [
    {
        key: "id",
        name: "#"
    },
    {
        key: "name",
        name: "Name"
    },
    {
        key: "email",
        name: "Email"
    },
    {
        key: "role",
        name: "Role"
    },
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Users() {
    const { user, isLoad } = useContext(CurrentUserContext);
    const { users, setUsers } = useContext(UsersContext);
    const cookie = Cookie();
    const token = cookie.get("e-commerce");

    const [currentUser, setCurrentUser] = useState("");
    const [searchedVal, setSearchedVal] = useState('');

    const thisUser = currentUser || false;
    const [sort, setSort] = useState({ keyToSort: "id", direction: "asc" });
    const [open, setOpen] = React.useState(false);
    const [userEdit, setUserEdit] = useState("");
    const [userEditIndex, setUserEditIndex] = useState();

    const [openDD, setOpenDD] = useState(false);
    const [dDUser, setDDUser] = useState("");


    useEffect(() => {
        setCurrentUser(user);
    }, [user]);


    function handelHeaderSortClick(column) {
        setSort({
            keyToSort: column.key,
            direction:
                sort.keyToSort === column.key
                    ? sort.direction === "asc" ? "desc" : "asc"
                    : "desc",
        })
    }

    function getSortData(dataToSort) {
        if (sort.direction === 'asc') {
            return dataToSort.sort((a, b) => (a[sort.keyToSort] > b[sort.keyToSort] ? 1 : -1))
        }
        return dataToSort.sort((a, b) => (a[sort.keyToSort] > b[sort.keyToSort] ? -1 : 1))
    }
    function searchData(data) {
        return data.filter((row) => !searchedVal.length ||
            header.map((key, index) =>
                [row[header[index].key]])
                .toString()
                .toLowerCase()
                .includes(searchedVal.toString().toLowerCase()))
    }
    const handleEditClickOpen = (row, index) => {
        setUserEdit(row);
        setUserEditIndex(index);
        setOpen(true);
    };

    function deleteUsers(row) {
        setDDUser(row);
        setOpenDD(true);
    }

    return (
        <div>
            <div className="mb-3 d-flex justify-content-between w-100">
                <h4 className=" px-4 my-auto border-dark border-end border-1 ">Users</h4>
                <div className="d-flex">
                    <CustomSearch setSearchedVal={setSearchedVal} />
                </div>
            </div>


            <table className="table table-hover" >
                <thead style={{
                    position: "sticky",
                    top: "64px",
                    zIndex: 1,
                }}>
                    <tr>
                        {header.map((item) =>
                            <th scope="col" className="justify-content-between" onClick={() => handelHeaderSortClick(item)}>
                                <div className='div-th-head-table-users' >
                                    <span> {item.name} </span>
                                    <span>{<TableSortLabel active={sort.keyToSort === item.key ? true : false}
                                        direction={sort.keyToSort === item.key ? sort.direction : "asc"}
                                    />}</span>
                                </div>
                            </th>)}
                        <th scope="col"><div className='div-th-head-table-users'> action </div></th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 && <tr><td colSpan="12">
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    </td></tr>}

                    {searchData(getSortData(users)).map((row, index) =>

                        <tr id={"tr" + row.id} key={index} className="align-middle ">
                            {
                                header.map((col, index1) => {
                                    return <td>
                                        {printCell(thisUser, currentUser, row, col, index)}
                                    </td>
                                })
                            }
                            <td>
                                <div className="" style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                }}>

                                    <IconButton sx={{
                                        width: 35,
                                        height: 35,
                                        visibility: !checkDeletePermission(thisUser, currentUser, row) && "hidden",
                                    }}
                                        onClick={(e) => deleteUsers(row)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>

                                    <IconButton sx={{ width: 35, height: 35, }}
                                        onClick={() => handleEditClickOpen(row, index)}
                                    >
                                        <EditCalendarIcon />
                                    </IconButton>

                                </div>
                            </td>
                        </tr>
                    )
                    }
                </tbody>
            </table>

            <DialogEdit
                userEdit={userEdit} setUserEdit={setUserEdit}
                users={users} setUsers={setUsers}
                userEditIndex={userEditIndex}
                open={open} setOpen={setOpen}
                token={token}
            />
            <DialogDelete
                open={openDD} setOpen={setOpenDD}
                user={dDUser}
                users={users} setUsers={setUsers}
                cookie={cookie}
            />


        </div>

    );
}

function CustomSearch({ setSearchedVal }) {
    const refInputSearch = useRef(null);
    const [isSearchClick, setIsSearchClick] = useState(false);

    function handleSearch() {
        if (isSearchClick) {
            refInputSearch.current.value === "" && setIsSearchClick(false);
            setSearchedVal(refInputSearch.current.value);
        } else {
            setIsSearchClick(true);
            refInputSearch.current.focus();
        }

    }

    return (
        <>
            <Paper
                sx={{
                    m: "auto", mx: "10px", p: '2px 4px', display: 'flex', alignItems: 'center', width: "auto", height: 40,
                    boxShadow: 'none',
                    border: 'none',
                }}
            >
                <InputBase
                    inputRef={refInputSearch}
                    sx={{ ml: 1, flex: 1, width: isSearchClick ? "20ch" : "0ch", transition: ".4s" }}
                    placeholder="Search..."
                    inputProps={{ 'aria-label': 'search google maps' }}
                    // set onBlur
                    onBlur={() => {
                        // setIsSearchClick(false);
                    }}

                />
                <IconButton type="button" sx={{ p: '7px' }} aria-label="search" onClick={() => {
                    handleSearch();
                }}>
                    <SearchIcon />
                </IconButton>
            </Paper >

        </>
    )
}

function printCell(thisUser, currentUser, row, col, index) {
    // if (col.key === "id") {
    //     return row[col.key];
    // } else
    if (thisUser) {
        if (((row[col.key] === currentUser.name) && (currentUser.id === row.id))) {
            return row[col.key] + " (You)";
        } else {
            return row[col.key];
        }
    } else {
        if (row.image === row[col.key]) {
            return <img height={60} src={row[col.key]} />;
        } else {
            return row[col.key];
        }
    }
}

function checkDeletePermission(thisUser, currentUser, row) {
    if (thisUser) {
        if (currentUser.id !== row.id && row.role !== "Admin") {
            return true
        } else {
            return false;
        }
    } else {
        return TramOutlined
    }
}


function DialogEdit(props) {
    const { userEdit, setUserEdit, users, setUsers, userEditIndex, open, setOpen, token } = props;

    const [loading, setLoading] = useState(false);
    const [emailIsAvailable, setEmailIsAvailable] = useState("hidden");
    const [txtErrorRes, setTxtErrorRes] = useState("");

    const handleClose = () => {
        setOpen(false);
        setEmailIsAvailable("hidden")
    };
    const onSubmitEditUser = async () => {
        setLoading(true);
        await axios.post(`${BASEURL}/${USER_EDIT}/${userEdit.id}`, userEdit, AuthorizatioN(token))
            .then(() => {
                setUsers(users.map((user, index) => index === userEditIndex ? {
                    ...user
                    , name: userEdit.name
                    , email: userEdit.email
                    , role: userEdit.role
                } : user));
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
                <DialogTitle id="alert-dialog-title">{"Edit user"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description" >
                        <div className='d-flex flex-column'>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <TextField className="mb-3" id="standard-basic" label="Name" variant="standard"
                                        value={userEdit.name || ""}
                                        onChange={(e) => setUserEdit({ ...userEdit, name: e.target.value })} />
                                    <TextField className="mb-3" id="standard-basic" label="Email" variant="standard"
                                        value={userEdit.email || ""}
                                        onChange={(e) => setUserEdit({ ...userEdit, email: e.target.value })}
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={userEdit.role || ""}
                                            label="Role"
                                            onChange={(e) => {
                                                setUserEdit({ ...userEdit, role: e.target.value });
                                            }
                                            }
                                        >
                                            <MenuItem value={"Admin"}>Admin</MenuItem>
                                            <MenuItem value={"Data entry"}>Data entry</MenuItem>
                                            <MenuItem value={"User"}>User</MenuItem>
                                        </Select>
                                    </FormControl>

                                </FormControl>
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


function DialogDelete(props) {
    const { open, setOpen, user, users, setUsers, cookie } = props;

    const [loading, setLoading] = useState(false);
    const [emailIsAvailable, setEmailIsAvailable] = useState("hidden");
    const [txtErrorRes, setTxtErrorRes] = useState("");

    const handleClose = () => {
        setOpen(false);
        setEmailIsAvailable("hidden")
    };
    const onSubmitEditUser = async () => {
        setLoading(true);

        const fetchUsers = async () => {
            await axios.delete(`${BASEURL}/${USER}/${user.id}`,
                AuthorizatioN(cookie.get("e-commerce")))
                .then((res) => {
                    setUsers(users.filter(val => val.id !== user.id));
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
                <DialogTitle id="alert-dialog-title">{"delete this user ?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description" >
                        <div className='d-flex flex-column'>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    id: {user.id}
                                </FormControl>
                                <FormControl fullWidth>
                                    name: {user.name}
                                </FormControl>
                                <FormControl fullWidth>
                                    email: {user.email}
                                </FormControl>
                                <FormControl fullWidth>
                                    role: {user.role}
                                </FormControl>
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



