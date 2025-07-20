import axios from "axios";
import { Add_CAT, AuthorizatioN, BASEURL } from "../../../Api/Api";
import Cookie from 'cookie-universal';
import { useContext, useEffect, useRef, useState } from "react";
import Form from 'react-bootstrap/Form';
import { FloatingLabel } from "react-bootstrap";
import { imageDB } from "../../../Api/Firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { Alert, Button, FormControl, TextField } from "@mui/material";
import { DashboardContext } from "../../../Context/ContextDashboard";
import { useNavigate } from "react-router-dom";

export default function AddCategory() {
    const contextDashboard = useContext(DashboardContext);
    const nav = useNavigate();
    const [title, setTitle] = useState("");
    const [image, setImage] = useState();
    const cookie = Cookie();
    const [alertVisibility, setAlertVisibility] = useState("hidden");
    const [txtErrorRes, setTxtErrorRes] = useState("");

    const [showImage, setShowImage] = useState();
    const [showImageSize, setShowImageSize] = useState();
    const [imageSizeGood, setImageSizeGood] = useState(false);
    useEffect(() => {
        if (image) {
            const img = new Image();
            img.src = URL.createObjectURL(image);
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

    async function HandelSubmit() {
        var imagePath = "";
        const imgRef = ref(imageDB, `images_categories/${v4()}`);
        await uploadBytes(imgRef, image);
        await getDownloadURL(imgRef).then(url => {
            imagePath = url;
        });
        const form = new FormData();
        form.append("title", title);
        form.append("image", imagePath);

        await axios.post(`${BASEURL}/${Add_CAT}`, form, AuthorizatioN(cookie.get("e-commerce")))
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
    }

    const focus = useRef(null);
    useEffect(() => {
        focus.current.focus();
    }, [])

    return (
        <div className='d-flex flex-column' style={{
            minWidth: "250px",
            width: "50vw",
            margin: "auto",
        }}>
            <FormControl fullWidth  >

                <TextField className="mb-3" id="standard-basic" label="Title" name='title' variant="standard"
                    value={title} onChange={(e) => setTitle(e.target.value)} inputRef={focus} />

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
                            onClick={HandelSubmit}
                        >Add Category</Button>

                    </div>

                </div>
            </FormControl>
        </div>

    );
}
