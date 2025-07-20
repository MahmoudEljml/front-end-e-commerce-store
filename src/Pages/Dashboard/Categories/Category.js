import { useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { AuthorizatioN, BASEURL, EDIT_CAT, GET_CAT, USER, USER_EDIT } from '../../../Api/Api';
import axios from 'axios';
import Cookie from 'cookie-universal';
import { useNavigate, useParams } from 'react-router-dom';
import { imageDB } from "../../../Api/Firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { Alert, Button, FormControl, TextField } from "@mui/material";
import { DashboardContext } from '../../../Context/ContextDashboard';

export default function User() {
    const nav = useNavigate();

    const cookie = Cookie();
    const token = cookie.get('e-commerce');
    // const id = Number(window.location.pathname.replace("/dashboard/products/categories/", ""));

    var id = useParams().id;

    const [title, setTitle] = useState("");
    const [image, setImage] = useState();

    useEffect(() => {
        async function getUser() {
            const response = await axios.get(`${BASEURL}/${GET_CAT}/${id}`, AuthorizatioN(token))
                .then((res) => {
                    setTitle(res.data.title)
                    setImage(res.data.image)
                })
                .catch((error) => console.log(error.response));
        }
        getUser();

    }, []);


    const contextDashboard = useContext(DashboardContext);

    const [alertVisibility, setAlertVisibility] = useState("hidden");
    const [txtErrorRes, setTxtErrorRes] = useState("");
    const [showImage, setShowImage] = useState();
    const [showImageSize, setShowImageSize] = useState();
    const [imageSizeGood, setImageSizeGood] = useState(false);
    useEffect(() => {
        if (image) {
            const img = new Image();
            img.src = image instanceof File ? URL.createObjectURL(image) : image;
            img.onload = () => {
                setShowImageSize({ width: img.width, height: img.height });
                if ((img.width / img.height) < 0.7 || (img.width / img.height) > 1.3) {
                    setImageSizeGood(false);
                } else {
                    setImageSizeGood(true);
                }
            };
            setShowImage(img.src);

        }
        console.log(image)
    }, [image])

    async function Submit() {
        var imagePath = "";
        if (image instanceof File) {
            const imgRef = ref(imageDB, `images_categories/${v4()}`);
            await uploadBytes(imgRef, image);
            await getDownloadURL(imgRef).then(url => {
                imagePath = url;
            });
        } else {
            imagePath = image;
        }
        const form = new FormData();
        form.append("title", title);
        form.append("image", imagePath);

        try {
            const response = await axios.post(`${BASEURL}/${EDIT_CAT}/${id}`, form,
                AuthorizatioN(token))
                .then(() => {
                    contextDashboard.setPath("/dashboard/categories/list");
                    nav("/dashboard/categories/list");
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

        } catch (error) {
            console.log("error:     ", error.response);
        }
    }

    return (
        <div className='d-flex flex-column' style={{
            minWidth: "250px",
            width: "50vw",
            margin: "auto",
        }}>
            <FormControl fullWidth  >
                <TextField className="mb-3" id="standard-basic" label="Title" name='title' variant="standard"
                    value={title} onChange={(e) => setTitle(e.target.value)} />

                <FloatingLabel label="Image" className="mb-3">
                    <Form.Control accept="image/*" type='file' id='image' name='image' placeholder=""
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </FloatingLabel>

                <div className="div-btn-image-add-category">
                    {showImage &&
                        <div className="div-img-new-category">
                            <img className="img-new-category" src={showImage} />

                            <div className="div-features">
                                <div>{showImageSize && "width: " + showImageSize.width}</div>
                                <div>{showImageSize && "height: " + showImageSize.height}</div>
                                <div className="d-flex div-img-condition-new-category">
                                    <div>{"Dimensions"}</div>
                                    <img className="img-condition-new-category"
                                        src={imageSizeGood
                                            ? require("../../../assets/images/true_icon.png")
                                            : require("../../../assets/images/false_icon.png")
                                        }
                                    />
                                </div>
                            </div>

                        </div>
                    }
                    <div className='mb-5'>
                        <Alert className='my-2' sx={{ visibility: alertVisibility }} severity="warning">{txtErrorRes}</Alert>
                        <Button variant="outlined"
                            onClick={Submit}
                        >Edit Category</Button>

                    </div>


                </div>
            </FormControl>
        </div>

    );
}