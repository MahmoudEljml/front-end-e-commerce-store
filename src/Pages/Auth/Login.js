import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import axios from 'axios';
import { BASEURL, LOGIN, LOGIN_WITH_GOOGLE } from '../../Api/Api';
import './style.css';
import Cookies from 'cookie-universal';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function Submit(e) {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASEURL}/${LOGIN}`, form);
            const cookie = Cookies();
            const token = response.data.token;
            cookie.set("e-commerce", token);
            console.log(response.data.user.role);
            const go = ["Admin", "Data entry"].includes(response.data.user.role) ? "/dashboard" : "";
            window.location.pathname = go;
        } catch (error) {
            console.log("error:     ", error.response);
        }
    }

    return (
        <div className="d-flex position-fixed top-50 start-50 translate-middle" >
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        {/* onSubmit={handleSubmit} */}
                        <Box component="form" onSubmit={(e) => Submit(e)} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={form.email} onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={form.password} onChange={handleChange}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, textTransform: "none" }}
                            >
                                Sign In
                            </Button>
                            <Grid container sx={{
                                alignItems: "center"
                            }}>
                                <Grid item xs>
                                    <Link href={`${BASEURL}/${LOGIN_WITH_GOOGLE}`}>
                                        <Button sx={{
                                            textTransform: 'none',
                                        }} className='me-5'>
                                            <FontAwesomeIcon icon={faGoogle} className="mx-3" />
                                            <span >{"Continue with google"}</span>
                                        </Button>

                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/register" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </ div >
    );
}   