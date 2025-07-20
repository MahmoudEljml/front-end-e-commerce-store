import * as React from 'react';
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ADD_PRODUCT_IMAGES, AuthorizatioN, BASEURL, CAT, PRODUCT, PRODUCTS_EDIT } from "../../../Api/Api";
import Cookie from 'cookie-universal';
import { Button, Form } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useNavigate, useParams } from "react-router-dom";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDB } from "../../../Api/Firebase";
import { v4 } from "uuid";
import ShowImage from "./ShowImage";

import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';

export default function EditProduct() {
    const cookie = Cookie();
    const nav = useNavigate();
    const [submitLoadingButton, setSubmitLoadingButton] = useState(false);
    const [categories, setCategories] = useState([])
    const [oldImages, setOldImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [oldImagesAfterDelete, setOldImagesAfterDelete] = useState([]);
    const openInputImage = useRef(null);

    const idImage_Ref = useRef([]);
    const countIdImageRef = useRef(-1);

    const nameImage_Ref = useRef([]);
    const countNameImageRef = useRef(-1);

    const idResponse = Number(window.location.pathname.replace('/dashboard/products/list/', ""));

    const [form, setForm] = useState({
        category: 'select category',
        title: '',
        description: '',
        price: '',
        discount: '',
        About: '',
    });

    useEffect(() => {
        async function getCategories() {
            try {
                await axios.get(`${BASEURL}/${CAT}`, AuthorizatioN(cookie.get("e-commerce")))
                    .then((res) => {
                        setCategories(res.data);
                    });
            } catch (error) {
                console.log(error)
            }
        }
        getCategories();

        async function getImages() {
            try {
                await axios.get(`${BASEURL}/${PRODUCT}/${idResponse}`, AuthorizatioN(cookie.get("e-commerce")))
                    .then((res) => {
                        setForm(res.data[0]);
                        setOldImages(res.data[0].images);
                    });

            } catch (error) {
                console.log(error)
            }
        }
        getImages();
    }, []);

    const print = categories.map((item, key) => {
        return <option key={key} value={item.id}>{item.title}</option>
    });

    async function handelChange(e) {
        const { name, value } = e.target;
        if (name === "discount" || name === "price") {
            if (isNaN(value)) {
                alert("Discount must be a valid number");
                return;
            } else if (value === "") {
                setForm({ ...form, [name]: 0 });
            } else {
                setForm({ ...form, [name]: parseFloat(value) });
            }
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    }

    async function deleteImage(key, image) {
        const idDeleteImage = idImage_Ref.current[key];
        const nameDeleteImage = nameImage_Ref.current[key];

        const split = nameDeleteImage.split("images_products%2F");
        const id = split[1].split("?alt=media&token=");
        const imageNameFromFireBase = id[0];

        try {
            const res = await axios.delete(`${BASEURL}/product-img/${idDeleteImage}`,
                AuthorizatioN(cookie.get("e-commerce")));

            const desertRef = ref(imageDB, `images_products/${imageNameFromFireBase}`);
            deleteObject(desertRef).then(() => {
            }).catch((error) => {
                console.log(error)
            });

            setNewImages((prev) => prev.filter((img) => img !== image));
            idImage_Ref.current = idImage_Ref.current.filter((i) => i !== idDeleteImage);
            nameImage_Ref.current = nameImage_Ref.current.filter((i) => i !== nameDeleteImage);
            --countIdImageRef.current;
            --countNameImageRef.current;
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteOldImage(key, image) {
        setOldImages((prev) => prev.filter((img) => img.id !== image.id));
        setOldImagesAfterDelete((prev) => [...prev, image]);
    }

    const uploading = useRef([]);

    const showImages = newImages.map((image, key) => (
        <ShowImage mode={"newImage"} image={image} key={key} deleteImage={() => deleteImage(key, image)} >
            <div className="custom-progress w-100" >
                <span
                    ref={(e) => (uploading.current[key] = e)}
                    style={{ width: "0" }}
                    percent={0}
                    className="inner-progress"></span>
            </div>
            <span className="auto-save-span">Saved without pressing the Save button</span>
        </ShowImage>
    ));

    const showOldImages = oldImages.map((image, key) => (
        <ShowImage mode={"oldImage"} image={image} key={key} deleteImage={() => deleteOldImage(key, image)} >

        </ShowImage>
    ));

    async function handelSelectImages(e) {
        setNewImages((prev) => [...prev, ...e.target.files]);

        const imagesSend = e.target.files;
        const form1 = new FormData();
        for (let i = 0; i < imagesSend.length; i++) {
            countIdImageRef.current++;
            countNameImageRef.current++;

            var imagePath = "";
            var imagePathInFireBase = `/images_products/${v4()}`;
            const imgRef = ref(imageDB, imagePathInFireBase);
            await uploadBytes(imgRef, imagesSend[i]);
            await getDownloadURL(imgRef).then(url => {
                imagePath = url;
            })
            form1.append("image", imagePath);
            form1.append('product_id', idResponse);
            try {
                const res = await axios.post(`${BASEURL}/${ADD_PRODUCT_IMAGES}`, form1,
                    {
                        headers: {
                            Authorization: 'Bearer ' + cookie.get("e-commerce")
                        },
                        onUploadProgress: (progressEvent) => {
                            const { loaded, total } = progressEvent;
                            const percent1 = Math.floor(loaded / total * 100);
                            if (percent1 % 20 === 0) {
                                uploading.current[countIdImageRef.current].style.width = `${percent1}%`;
                                uploading.current[countIdImageRef.current].setAttribute("percent", `${percent1}%`);
                            }
                        }
                    }
                );
                idImage_Ref.current[countIdImageRef.current] = res.data.id;
                nameImage_Ref.current[countNameImageRef.current] = res.data.image;
            } catch (error) {
                console.log(error.response.data);
            }
        }
    }
    function onSubmit(e) {
        e.preventDefault();
        setSubmitLoadingButton(true);
        async function responseImage() {
            const send = new FormData();
            send.append("category", form.category);
            send.append("title", form.title);
            send.append("description", form.description);
            send.append("price", form.price);
            send.append("discount", form.discount);
            send.append("About", form.About);
            try {
                for (let i = 0; i < oldImagesAfterDelete.length; i++) {
                    console.log(oldImagesAfterDelete[i]);
                    const imageName = oldImagesAfterDelete[i].image;
                    const desertRef = ref(imageDB, imageName);
                    deleteObject(desertRef).then(() => {
                        // File deleted successfully
                    }).catch((error) => {
                        // Uh-oh, an error occurred!
                    });

                    const res = await axios.delete(`${BASEURL}/product-img/${oldImagesAfterDelete[i].id}`,
                        AuthorizatioN(cookie.get("e-commerce")));
                }

                await axios.post(`${BASEURL}/${PRODUCTS_EDIT}/${idResponse}`, send,
                    AuthorizatioN(cookie.get("e-commerce"))
                );
                nav("/dashboard/products/list");
            } catch (error) {
                console.log(error.response)
            }
        }
        responseImage();
    }

    return (
        <div className="m-5 zn-1">
            <Form onSubmit={onSubmit}>
                <FloatingLabel variant="filled" label="Category" className="mb-3">
                    <Form.Select
                        name="category"
                        value={form.category}
                        onChange={handelChange}
                    >
                        <option value={"select category"} disabled>Select Category</option>
                        {print}
                    </Form.Select>
                </FloatingLabel>

                <FloatingLabel label="Title" className="mb-3">
                    <Form.Control
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handelChange}
                        required
                    />
                </FloatingLabel>
                <FloatingLabel label="Description" className="mb-3">
                    <Form.Control
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handelChange}
                        required
                    />
                </FloatingLabel>
                <FloatingLabel label="Price" className="mb-3">
                    <Form.Control
                        type="text"
                        name="price"
                        value={form.price}
                        onChange={handelChange}
                        required
                    />
                </FloatingLabel>
                <FloatingLabel label="Discount" className="mb-3">
                    <Form.Control
                        type="text"
                        name="discount"
                        value={form.discount}
                        onChange={handelChange}
                    />
                </FloatingLabel>
                <FloatingLabel label="About" className="mb-3">
                    <Form.Control
                        as="textarea"
                        name="About"    
                        style={{
                            height: "150px"
                        }}
                        rows={6}
                        value={form.About}
                        onChange={handelChange}
                        required
                    />
                </FloatingLabel>

                <FloatingLabel hidden label="Images" className="mb-3">
                    <Form.Control
                        ref={openInputImage}
                        multiple
                        type="file"
                        name="images"
                        onChange={handelSelectImages}
                    />
                </FloatingLabel>
                <div className="w-100 py-5 my-3  rounded-4" style={{
                    border: "dashed 2px #0086fe",
                    cursor: "pointer"
                }}
                    // disabled={onChangeCategory}
                    onClick={() => openInputImage.current.click()}>
                    <div className="d-flex justify-content-center flex-column align-items-center">
                        <img src={require("../../../assets/images/upload.png")} alt="upload image" width={100} />
                        <div className="fw-bold" style={{
                            color: "#3C6BD9"
                        }}>upload images</div>
                    </div>
                </div>
                <div>
                    {showOldImages}
                </div>
                <div >
                    {showImages}
                </div>
                <Stack direction="row" spacing={2}>
                    <LoadingButton className='mb-5'
                        loading={submitLoadingButton}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="outlined"
                        type="submit"
                    >
                        Save
                    </LoadingButton>
                </Stack>
                {/* <Button type="submit">Save</Button> */}
            </Form>

        </div>
    );
}

function checkImageSize(image) {
    if ((image.size / 1024) < 1000) {
        return (image.size / 1024).toFixed(2) + " KB";
    } else {
        return (image.size / (1024 * 1024)).toFixed(2) + " MB";
    }
}
