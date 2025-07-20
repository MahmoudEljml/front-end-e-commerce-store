import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button, IconButton } from "@mui/material";
import { ADD_NEW_USER, AuthorizatioN, BASEURL } from '../../../Api/Api';
import axios from 'axios';
import Cookie from 'cookie-universal';

import { Box, MenuItem, Alert, Select } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { DashboardContext } from '../../../Context/ContextDashboard';

import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { UsersContext } from '../../../Context/ContextUsers';

export default function CreateNewUser() {
    const { users, setUsers } = useContext(UsersContext);
    const nav = useNavigate();
    const cookie = Cookie();
    const token = cookie.get('e-commerce');
    const [alertVisibility, setAlertVisibility] = useState("hidden");
    const [txtErrorRes, setTxtErrorRes] = useState("");
    const contextDashboard = useContext(DashboardContext);
    const [showPassword, setShowPassword] = React.useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Admin',
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    async function Submit() {

        await axios.post(`${BASEURL}/${ADD_NEW_USER}`, form,
            AuthorizatioN(token)
        )
            .then(() => {
                setUsers([...users, form]);
                contextDashboard.setPath("/dashboard/users");
                nav("/dashboard/users");
            })
            .catch((error) => {
                if (error.response.data.message.length > 0) {
                    setTxtErrorRes(error.response.data.message);
                    setAlertVisibility("visibility");
                    setTimeout(() => {
                        setAlertVisibility("hidden");
                    }, 4000);
                    console.log(error.response.data.message)
                } else {
                    console.log("error users page: " + error)
                }
                console.log("error:     ", error.response.data.message);
            })
    }

    const focus = useRef(null);
    useEffect(() => {
        focus.current.focus();
    }, []);

    return (
        <>
            <div className='d-flex flex-column' style={{
                minWidth: "250px",
                width: "50vw",
                margin: "auto",
            }}>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <TextField className="mb-3" id="standard-basic" name="name" label="Name" variant="standard"
                            value={form.name || ""}
                            onChange={handleChange}
                            inputRef={focus}
                        />
                        <TextField className="mb-3"
                            id="standard-basic" name="email" label="Email" variant="standard"
                            value={form.email || ""}
                            onChange={handleChange}
                        />

                        <FormControl variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                autoComplete="current-password"
                                name="password"
                                onChange={handleChange}
                                value={form.password || ""}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>

                        <FormControl fullWidth className='my-3 mt-5'>
                            <InputLabel id="demo-simple-select-label">Role</InputLabel>
                            <Select
                                className='px-2'
                                variant="standard"
                                name="role"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={form.role || ""}
                                label="Role"
                                onChange={handleChange}
                            >
                                <MenuItem value={"Admin"}>Admin</MenuItem>
                                <MenuItem value={"Data entry"}>Data entry</MenuItem>
                                <MenuItem value={"User"}>User</MenuItem>
                            </Select>
                        </FormControl>

                    </FormControl>
                </Box>

                <Alert className='mb-3' sx={{ visibility: alertVisibility }} severity="warning">{txtErrorRes}</Alert>
                <Button variant="outlined" sx={{ maxWidth: 100, textTransform: "none" }} className='mb-5'
                    onClick={Submit}
                >Create</Button>
            </div >

        </>
    );

}