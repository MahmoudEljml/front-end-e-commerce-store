import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ADD_PRODUCT, ADD_PRODUCT_IMAGES, AuthorizatioN, BASEURL, CAT, PRODUCTS_EDIT } from "../../../Api/Api";
import Cookie from 'cookie-universal';
import { Button, Form } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useNavigate } from "react-router-dom";
import { faUserPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { imageDB } from "../../../Api/Firebase";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import ShowImage from "./ShowImage";

export default function AddProducts() {
    const nav = useNavigate();
    const [categories, setCategories] = useState([])
    const [images, setImages] = useState([]);
    const [idResponse, setIdResponse] = useState();
    const [onChangeCategory, setOnChangeCategory] = useState(true);
    const openInputImage = useRef(null);

    const idImage_Ref = useRef([]);
    const countIdImageRef = useRef(-1);

    const nameImage_Ref = useRef([]);
    const countNameImageRef = useRef(-1);

    const cookie = Cookie();

    const [form, setForm] = useState({
        category: 'select category',
        title: '',
        description: '',
        price: '',
        discount: '',
        About: '',
    });
    const firstForm = {
        category: null,
        title: '1',
        description: '1',
        price: 21,
        discount: 1,
        About: '1',
    };

    useEffect(() => {
        async function response() {
            try {
                await axios.get(`${BASEURL}/${CAT}`, AuthorizatioN(cookie.get("e-commerce")))
                    .then((res) => {
                        // console.log(res.data);
                        setCategories(res.data)
                    });
            } catch (error) {
                console.log(error)
            }
        }
        response();
    }, []);

    const print = categories.map((item, key) => {
        return <option key={key} value={item.id}>{item.title}</option>
    });

    async function handelChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setOnChangeCategory(false);

        if (idResponse === undefined) {
            try {
                const response = await axios.post(`${BASEURL}/${ADD_PRODUCT}`, firstForm,
                    AuthorizatioN(cookie.get("e-commerce"))
                );
                // console.log(response.data.id);
                setIdResponse(response.data.id);
            } catch (error) {
                console.log(error)
            }
        }
    }

    function onSubmit(e) {
        e.preventDefault();
        async function responseImage() {
            const send = new FormData();
            send.append("category", form.category);
            send.append("title", form.title);
            send.append("description", form.description);
            send.append("price", form.price);
            send.append("discount", form.discount);
            send.append("About", form.About);

            try {
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

    async function deleteImage(key, image) {
        const idDeleteImage = idImage_Ref.current[key];
        const pathDeleteImage = nameImage_Ref.current[key];
        const split = pathDeleteImage.split("images_products%2F");
        const id = split[1].split("?alt=media&token=");
        const imageNameFromFireBase = id[0];

        try {
            const res = await axios.delete(`${BASEURL}/product-img/${idDeleteImage}`,
                AuthorizatioN(cookie.get("e-commerce")))
                .catch((error) => console.log(error));

            const desertRef = ref(imageDB, `images_products/${imageNameFromFireBase}`);
            deleteObject(desertRef).then(() => {
                console.log("firebase deleted success")
            }).catch((error) => {
                console.log(error)
            });

            setImages((prev) => prev.filter((img) => img !== image));
            idImage_Ref.current = idImage_Ref.current.filter((i) => i !== idDeleteImage);
            nameImage_Ref.current = nameImage_Ref.current.filter((i) => i !== pathDeleteImage);
            --countIdImageRef.current;
            --countNameImageRef.current;
        } catch (error) {
            console.log(error)
        }
    }

    const uploading = useRef([]);
    const showImages = images.map((image, key) => (
        <ShowImage mode={"newImage"} image={image} key={key} deleteImage={() => deleteImage(key, image)} >
            <div className="custom-progress w-100" >
                <span
                    ref={(e) => (uploading.current[key] = e)}
                    style={{ width: "0" }}
                    percent={0}
                    className="inner-progress"></span>
            </div>
        </ShowImage>
    ));

    async function handelSelectImages(e) {
        setImages((prev) => [...prev, ...e.target.files]);
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
            console.log(imagePath);
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
                        disabled={onChangeCategory}
                    />
                </FloatingLabel>
                <FloatingLabel label="Description" className="mb-3">
                    <Form.Control
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handelChange}
                        required
                        disabled={onChangeCategory}
                    />
                </FloatingLabel>
                <FloatingLabel label="Price" className="mb-3">
                    <Form.Control
                        type="text"
                        name="price"
                        value={form.price}
                        onChange={handelChange}
                        required
                        disabled={onChangeCategory}
                    />
                </FloatingLabel>
                <FloatingLabel label="Discount" className="mb-3">
                    <Form.Control
                        type="text"
                        name="discount"
                        value={form.discount}
                        onChange={handelChange}
                        disabled={onChangeCategory}
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
                        disabled={onChangeCategory}

                    />
                </FloatingLabel>
                <FloatingLabel hidden label="Images" className="mb-3">
                    <Form.Control
                        ref={openInputImage}
                        multiple
                        type="file"
                        accept="image/*"
                        name="images"
                        onChange={handelSelectImages}
                        disabled={onChangeCategory}
                        rows={6}
                    />
                </FloatingLabel>
                <div className="w-100 py-5 my-3  rounded-4" style={{
                    border: "dashed 2px #0086fe",
                    cursor: "pointer"
                }}
                    disabled={onChangeCategory}
                    onClick={() => openInputImage.current.click()}>
                    <div className="d-flex justify-content-center flex-column align-items-center">
                        <img src={require("../../../assets/images/upload.png")} alt="upload image" width={100} />
                        <div className="fw-bold" style={{
                            color: "#3C6BD9"
                        }}>upload images</div>
                    </div>
                </div>
                <div className="">
                    {showImages}
                </div>
                <Button className='mb-5' type="submit">Save</Button>
            </Form>
        </div >
    );
}


function checkImageSize(image) {
    if ((image.size / 1024) < 1000) {
        return (image.size / 1024).toFixed(2) + " KB";
    } else {
        return (image.size / (1024 * 1024)).toFixed(2) + " MB";
    }
}
