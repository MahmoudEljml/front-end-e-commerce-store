import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';

import { useEffect, useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { AuthorizatioN, BaseAddCarouselImage, BaseCarouselEditDescription, BaseDeleteCarouselImage, BaseGetCarouselImages, BASEURL } from '../../../Api/Api';
import Cookie from 'cookie-universal';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import Slide from '@mui/material/Slide';
import { Alert } from '@mui/material';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { imageDB } from '../../../Api/Firebase';
import { v4 } from "uuid";

export default function CarouselSettings() {
    const [open, setOpen] = React.useState(false);
    const [selectedImageId, setSelectedImageId] = useState(null);

    const cookie = Cookie();
    const [images, setImages] = useState();
    const [description, setDescription] = useState("");

    const [lastImages, setLastImages] = useState([]);
    const [afterLoadImagesSize, setAfterLoadImagesSize] = useState({});

    useEffect(() => {
        async function getAllImages() {
            let res = await axios.get(`${BASEURL}/${BaseGetCarouselImages}`,
                AuthorizatioN(cookie.get("e-commerce")))
                .then(data => {
                    console.log(data);
                    setLastImages(data.data);
                })
                .catch(error => console.log(error));
        }
        getAllImages();
    }, []);

    const showImagesFromServer = lastImages.map((value, index) => {
        const img = new Image();
        img.src = value.url;
        img.onload = () => {
            setAfterLoadImagesSize((prev) => ({ ...prev, [index]: { width: img.width, height: img.height } }));
        };
        return (
            <Card sx={{ width: "100%", display: "flex", padding: "5px", margin: "7px" }}>
                <CardMedia
                    sx={{
                        width: "25%",
                        height: "17%",
                        minWidth: "150px",
                        minHeight: "100px",
                        margin: "auto",
                        borderRadius: "10px",
                    }}
                    component="img"
                    alt="carousel image"
                    image={value.url}
                />
                <CardContent sx={{
                    flex: "1",
                    margin: "auto"
                }}>
                    <Typography gutterBottom variant="h5" component="div">
                        <IconButton onClick={() => {
                            setSelectedImageId(value.id);
                            setOpen(true);
                        }}>
                            <EditIcon />
                        </IconButton>
                        {value.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary"
                        sx={{ position: "flex", }}
                    >
                        {afterLoadImagesSize[index] ? (
                            <>
                                <div>width: {afterLoadImagesSize[index].width}px</div>
                                <div>height: {afterLoadImagesSize[index].height}px</div>
                            </>
                        ) : (
                            <div>Loading...</div>
                        )}
                    </Typography>
                </CardContent>
                <CardActions sx={{ position: "relative" }}>
                    <IconButton size="small"
                        onClick={() => deleteImage(value)}
                        sx={{
                            position: "absolute",
                            top: "10px",
                            right: "10px"
                        }}>
                        <CloseIcon />
                    </IconButton>
                </CardActions>
            </Card>
        )
    });

    async function deleteImage(value) {
        const res = await axios.delete(`${BASEURL}/${BaseDeleteCarouselImage}/${value.id}`,
            AuthorizatioN(cookie.get("e-commerce")))
            .catch((error) => { console.log(error); });
        setLastImages((prev) => prev.filter((img) => img.url !== value.url))
    }

    async function handelSelectImages(e) {
        const file = e.target.files[0];
        setImages(file);
    }

    async function onSubmit() {
        if (images != undefined) {
            var imagePath = "";
            const imgRef = ref(imageDB, `images_carousel/${v4()}`);
            await uploadBytes(imgRef, images);
            await getDownloadURL(imgRef).then(url => {
                imagePath = url;
            })
            const formData = new FormData();
            formData.append("url", imagePath);
            formData.append("description", description);
            const res = await axios.post(`${BASEURL}/${BaseAddCarouselImage}`, formData,
                AuthorizatioN(cookie.get("e-commerce")))
                .catch((error) => { console.log(error); });
            setLastImages((prev) => [...prev, res.data]);
        } else {
            const alertSelectImage = document.getElementById("alertSelectImage");
            alertSelectImage.style.visibility = "visible";
            // make setTimeout and hidden alertSelectImage after 3 sec
            setTimeout(() => {
                alertSelectImage.style.visibility = "hidden";
            }, 3000);
        }
    }

    return (
        <div>
            <Form>
                <TextField id="standard-basic" label="Description" variant="standard" className="mb-3"
                    value={description}
                    sx={{ width: "100%" }}
                    inputProps={{ maxLength: 60, }}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <FloatingLabel label="Images" className="mb-3">
                    <Form.Control type="file" name="images" onChange={e => handelSelectImages(e)} />
                </FloatingLabel>
                <div className='d-flex'>
                    <Button sx={{ textTransform: "none", marginLeft: '5%' }} variant="outlined" onClick={() => onSubmit()}>Add</Button>
                    <Alert sx={{ visibility: "hidden" }} id="alertSelectImage" severity="error">Select Image.</Alert>
                </div>
            </Form>
            <div className="my-3">
                {showImagesFromServer}
            </div>
            <AlertDialog open={open} setOpen={setOpen} id={selectedImageId} setLastImages={setLastImages} />

        </div>
    );
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function AlertDialog({ open, setOpen, id, setLastImages }) {
    const cookie = Cookie();

    const handleClose = () => {
        setOpen(false);
        document.getElementById("textChangeDescription").value = "";
    };

    const handleSendRequest = () => {
        const textChangeDescription = document.getElementById("textChangeDescription").value;
        const formData = new FormData();
        formData.append('id', id);
        formData.append('description', textChangeDescription);
        async function editDescription() {
            await axios.post(`${BASEURL}/${BaseCarouselEditDescription}`, formData, AuthorizatioN(cookie.get("e-commerce")))
                .then((data) => {
                    setLastImages((prev) => {
                        return prev.map((item) => {
                            if (item.id === id) {
                                item.description = data.data.description;
                            }
                            return item;
                        })
                    })
                })
                .catch((error) => console.log(error));
        }
        editDescription();
        handleClose();
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-title">

                </DialogTitle>
                <DialogContent>
                    <TextField
                        sx={{ width: "300px" }}
                        autoFocus
                        margin="dense"
                        label="new Description"
                        id="textChangeDescription"
                        fullWidth
                        variant="standard"
                        inputProps={{ maxLength: 60, }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={handleSendRequest} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}