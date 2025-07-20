import * as React from 'react';
import axios from "axios"
import { AuthorizatioN, BASEURL, AddMerge, EditMergE, GetMerge } from "../../../Api/Api"
import Cookie from 'cookie-universal';
import Box from '@mui/material/Box';
import { CategoriesContext } from "../../../Context/ContextCategories";
import { useEffect, useContext, useState } from 'react';
import { Alert, FormControl, TextField, Button } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AddEditMerge() {
    const location = useLocation();
    const idSplit = Number(location.pathname.split("/").pop());
    const id = isNaN(idSplit) ? null : idSplit;
    const cookie = Cookie();
    const token = cookie.get('e-commerce');
    const { categories } = useContext(CategoriesContext);
    const [packageName, setPackageName] = React.useState('');
    const [merge, setMerge] = useState([]);
    const [checked, setChecked] = React.useState([]);
    const [alertVisibility, setAlertVisibility] = useState("hidden");
    const [txtErrorRes, setTxtErrorRes] = useState("");
    const nav = useNavigate();

    useEffect(() => {
        if (id != null) {
            axios.get(`${BASEURL}/${GetMerge}/${id}`, AuthorizatioN(token))
                .then((data) => {
                    setPackageName(data.data.package_name);
                    const mergeArray = JSON.parse(data.data.merge);
                    setMerge(mergeArray);
                    setChecked(mergeArray)
                })
        } else {
            setPackageName('');
            setMerge([]);
            setChecked([]);
        }
    }, [id])

    const handleToggle = (id) => () => {
        const currentIndex = checked.indexOf(id);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(id);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
        setMerge(newChecked);
    };

    const deleteSelected = (id) => () => {
        const newChecked = [...checked];
        const index = newChecked.indexOf(id);
        if (index !== -1) {
            newChecked.splice(index, 1);
        }
        setChecked(newChecked);
        setMerge(newChecked);
    }

    const form = {
        package_name: packageName,
        merge: JSON.stringify(merge),
    }

    async function sendRequestMerge() {
        if (id != null) {
            // edit
            const res = axios.post(`${BASEURL}/${EditMergE}/${id}`, form, AuthorizatioN(token))
                .then(() => {
                    nav("/dashboard/merges")
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
                });
        } else {
            // add
            const res = axios.post(`${BASEURL}/${AddMerge}`, form, AuthorizatioN(token))
                .then(() => { nav("/dashboard/merges") })
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
                });
        }

    }


    const selectedMerge = categories.map((val) => {

        if (merge.includes(val.id)) {
            return (
                <ListItem
                    key={val.id}
                    secondaryAction={
                        <IconButton onClick={deleteSelected(val.id)} edge="end" aria-label="comments">
                            <DeleteIcon />
                        </IconButton>
                    }
                    disablePadding
                >
                    <ListItemButton >
                        <ListItemText primary={val.title} />
                    </ListItemButton>
                </ListItem>
            )
        }

    })

    const focus = React.useRef(null);
    useEffect(() => {
        focus.current.focus();
    }, [])

    return (
        <div className='d-flex flex-column' style={{
            minWidth: "250px",
            width: "50vw",
            margin: "auto",
        }}>

            <div className=' mb-3'>
                Categories in one package
            </div>
            <div className='d-flex gap-3 mb-3'>
                <List sx={{
                    overflowY: "scroll", maxHeight: '300px', width: '100%', bgcolor: '#F6F7F8',
                }}>
                    {
                        categories.map((category, index) => {
                            const labelId = `checkbox-list-label-${category.id}`;
                            return <ListItem key={category.id}>
                                <ListItemButton role={undefined} onClick={handleToggle(category.id)} dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checked.indexOf(category.id) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={category.title} />
                                </ListItemButton>
                            </ListItem>
                        })
                    }
                </List>
            </div>

            <FormControl fullWidth>

                <TextField className="mb-3" id="standard-basic" label="Package name" name='package_name' variant="standard"
                    value={packageName} onChange={(e) => setPackageName(e.target.value)} inputRef={focus}
                    sx={{
                        position: "sticky",
                        top: 70,
                        zIndex: 1,
                        backgroundColor: "white"
                    }}
                />


                <Box>

                    <List sx={{
                        width: '100%', bgcolor: '#F6F7F8',
                    }}>
                        {selectedMerge}
                    </List>
                </Box>

                <div className='mb-5'>
                    <Alert className='my-2' sx={{ visibility: alertVisibility }} severity="warning">{txtErrorRes}</Alert>
                    <Button variant="outlined" sx={{ textTransform: "none" }}
                        onClick={sendRequestMerge}
                    >{id != null ? "Edit merge" : "Add merge"}</Button>
                </div>
            </FormControl>


        </div>
    )
}