import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import axios from 'axios';
import { AllMerge, AuthorizatioN, BASEURL, DeleteMerge } from '../../../Api/Api';
import { CategoriesContext } from '../../../Context/ContextCategories';
import Cookie from 'cookie-universal';
import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, TextField, Paper, InputBase, Typography } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material";
import { InputLabel, MenuItem, FormControl, Select, Alert, TableSortLabel, LinearProgress } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function Merges() {
    const categoriesContext = React.useContext(CategoriesContext);
    const { categories } = categoriesContext;

    const cookie = Cookie();
    const [treeData, setTreeData] = React.useState([]);
    const nav = useNavigate();

    const [openDD, setOpenDD] = React.useState(false);
    const [mergeDelete, setMergeDelete] = React.useState([]);


    React.useEffect(() => {
        const data = axios.get(`${BASEURL}/${AllMerge}`, AuthorizatioN(cookie.get('e-commerce')))
            .then((data) => {
                setTreeData(data.data);
            })
            .catch((error) => {
                console.log(error);
            });


    }, []);


    const data = treeData.map((val, index) => {
        const id = val.id;
        const packageName = val.package_name;
        const mergeStr = val.merge != undefined ? JSON.parse(val.merge) : [];
        const merge = [];
        categories.map(val => {
            if (mergeStr.includes(val.id)) {
                merge.push(val.title)
            }
        })
        return (
            <TreeItem key={index} itemId={"g-" + index}
                label=
                {
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>{packageName}</div>
                        <div>
                            <IconButton sx={{ width: "40px", height: "30px" }} onClick={() => nav("" + id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton sx={{ width: "40px", height: "30px" }} onClick={() => {
                                setMergeDelete(val)
                                setOpenDD(!openDD);

                            }}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </div>
                }

            >
                {
                    merge.map((item, index1) => {
                        return (
                            <TreeItem key={index1} itemId={"g-" + index1 + index} label={item} />
                        );
                    })
                }

            </TreeItem>
        );



    });

    return (
        <>
            <Box sx={{ minHeight: 352, minWidth: 250 }}>
                <SimpleTreeView>
                    {data}
                </SimpleTreeView>
            </Box>


            <DialogDelete
                open={openDD} setOpen={setOpenDD}
                mergeDelete={mergeDelete}
                treeData={treeData} setTreeData={setTreeData}
                cookie={cookie}
                categories={categories}
            />
        </>

    )
}



function DialogDelete(props) {
    const { open, setOpen, mergeDelete, treeData, setTreeData, cookie, categories } = props;
    const convertStrToArray = mergeDelete.merge != undefined ? JSON.parse(mergeDelete.merge) : [];
    const mergeDeleteTitle = convertStrToArray.map((categoryId) => {
        const category = categories.find((category) => category.id === categoryId);
        return category ? category.title : '';
    })


    const [loading, setLoading] = React.useState(false);
    const [emailIsAvailable, setEmailIsAvailable] = React.useState("hidden");
    const [txtErrorRes, setTxtErrorRes] = React.useState("");


    const handleClose = () => {
        setOpen(false);
        setEmailIsAvailable("hidden")
    };
    const onSubmitEditUser = async () => {
        setLoading(true);

        const fetchUsers = async () => {
            await axios.delete(`${BASEURL}/${DeleteMerge}/${mergeDelete.id}`,
                AuthorizatioN(cookie.get("e-commerce")))
                .then((res) => {
                    setTreeData(treeData.filter(val => val.id !== mergeDelete.id));
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
                <DialogTitle id="alert-dialog-title">{"delete this merge ?"}</DialogTitle>
                <DialogContent>
                    <Typography id="alert-dialog-slide-description" >
                        <div className='d-flex flex-column'>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    id: {mergeDelete.id}
                                </FormControl>
                                <FormControl fullWidth>
                                    package name: {mergeDelete.package_name}
                                </FormControl>
                                {mergeDeleteTitle.map((val) =>
                                    <FormControl fullWidth>
                                        {val}
                                    </FormControl>
                                )}

                            </Box>
                            <Alert sx={{ visibility: emailIsAvailable }} severity="warning">{txtErrorRes}</Alert>
                        </div>
                    </Typography>
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