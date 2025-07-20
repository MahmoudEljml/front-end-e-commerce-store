import React, { useRef, useState } from "react";
import { useContext, useEffect } from "react";
import { CurrentUserCartContext } from "../../../Context/ContextCurrentUserCart";
import { CurrentUserContext } from "../../../Context/ContextCurrentUser";
import "./style.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Slide, TextField } from '@mui/material';
import axios from "axios";
import { acceptPhoneNumber, addPhone, addToCart, AuthorizatioN, BASEURL, deleteFromCart, removeFromCart } from "../../../Api/Api";
import Cookie from "cookie-universal";
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from "@mui/lab";
import SendIcon from '@mui/icons-material/Send';
import DoneIcon from '@mui/icons-material/Done';
import 'react-phone-number-input/style.css'
import toast, { Toaster } from "react-hot-toast";
import NetworkLockedIcon from '@mui/icons-material/NetworkLocked';
import { MuiOtpInput } from "mui-one-time-password-input";

export default function CartPage() {
    const cookie = Cookie();
    const token = cookie.get("e-commerce");
    const currentUserCartContext = useContext(CurrentUserCartContext);
    const { user, setUser } = useContext(CurrentUserContext);

    const { cart, setCart } = currentUserCartContext;
    const [data, setData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [rival, setRival] = useState(0);
    const [openAlertDialog, setOpenAlertDialog] = React.useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);


    useEffect(() => {
        setData([]);

        var allPrice = 0;
        var allDiscount = 0;
        for (let i = 0; i < cart?.length; i++) {
            setData((preData) => [
                ...preData,
                {
                    id: cart[i]?.product_details?.id,
                    title: cart[i]?.product_details?.title,
                    description: cart[i]?.product_details?.description,
                    price: cart[i]?.product_details?.price,
                    discount: cart[i]?.product_details?.discount,
                    About: cart[i]?.product_details?.About,
                    images: cart[i]?.product_details?.images,
                    productQuantity: cart[i]?.quantity,
                    allPrice: cart[i]?.product_details?.price * cart[i]?.quantity,
                    allDiscount: cart[i]?.product_details?.discount * cart[i]?.quantity,
                    allPresentDiscount: `-${(100
                        - ((cart[i]?.product_details?.discount * cart[i]?.quantity)
                            / (cart[i]?.price * cart[i]?.quantity))
                        * 100)
                        .toFixed(0)}%`,
                },
            ]);

            allPrice += cart[i]?.product_details?.price * cart[i]?.quantity
            allDiscount += cart[i]?.product_details?.discount * cart[i]?.quantity;
        }

        var riv = allPrice - allDiscount;
        setTotalPrice(allPrice);
        setTotalDiscount(allDiscount);
        setRival(riv);

        if (`${user?.phone}`.includes("-otp->") || user?.phone == undefined || user?.phone == null) {
            setPhoneNumber("")
            setIsPhoneVerified(false)
        } else {
            setPhoneNumber(`${user?.phone}`)
            setIsPhoneVerified(true)
        }

    }, [cart]);

    const handleDeleteProduct = (index, productId) => {
        const updateCart = [...cart];
        updateCart.splice(index, 1);
        setCart(updateCart);

        const form = new FormData();
        form.append('user_id', user.id);
        form.append('product_id', productId);

        axios.post(`${BASEURL}/${deleteFromCart}`, form, AuthorizatioN(token))
            .then((response) => {
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const handleQuantityChange = (index, productId, plus) => {
        const updateCart = [...cart];
        if (updateCart[index].quantity === 1 && plus === -1) {
            updateCart.splice(index, 1);
        } else {
            updateCart[index].quantity += plus;
        }
        setCart(updateCart);
        const form = new FormData();
        form.append('user_id', user.id);
        form.append('product_id', productId);
        const request = plus > 0 ? addToCart : removeFromCart;
        axios.post(`${BASEURL}/${request}`, form, AuthorizatioN(token))
            .then((response) => {
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }


    useEffect(() => {
        if (phoneNumber != user.phone) {
            setIsPhoneVerified(false)
        } else {
            setIsPhoneVerified(true)
        }
    }, [phoneNumber])

    const showProducts = data.map((item, index) => {

        return (
            <div key={index}>
                <div className="row">
                    <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                        <div className="bg-image hover-overlay hover-zoom ripple rounded"
                            data-mdb-ripple-color="light"
                        >
                            <img src={item.images.length > 0 && item.images[0].image} className="w-100" alt="Blue Jeans Jacket" />
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
                        <p>
                            <p>{item.title} </p>
                        </p>
                    </div>

                    <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                        <div className="d-flex mb-4" style={{ maxWidth: 300 }}>
                            <IconButton disabled={item.productQuantity >= 5} sx={{ width: "50px", height: "50px" }} onClick={() => handleQuantityChange(index, item.id, 1)}   >
                                <AddIcon />
                            </IconButton >
                            <div data-mdb-input-init className="form-outline">
                                <div style={{
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>{item.productQuantity}</div>
                            </div>
                            <IconButton disabled={item.productQuantity <= 1} sx={{ width: "50px", height: "50px" }} onClick={() => handleQuantityChange(index, item.id, -1)} >
                                <RemoveIcon />
                            </IconButton>
                            <IconButton sx={{ width: "50px", height: "50px" }} onClick={() => {
                                handleDeleteProduct(index, item.id)
                            }}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                        <p className="text-start text-md-center">
                            <strong >{item.price} جنيه</strong>
                        </p>
                    </div>
                </div>
                <hr className="my-4" />
            </div>
        )
    });

    return (
        <div>
            <section className="h-100" dir="rtl">
                <div className="container py-5">
                    <div className="row d-flex justify-content-center my-4">
                        <div className="col-md-8">
                            <div className="card mb-4">
                                <div className="card-header py-3">
                                    <h5 className="mb-0">السلة ({cart.length})</h5>
                                </div>
                                <div className="card-body">
                                    {showProducts}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card mb-4">
                                <div className="card-header py-3">
                                    <h5 className="mb-0" dir="rtl">ملخص سلة التسوق</h5>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                            <div>
                                                <strong>السعر</strong>
                                            </div>
                                            <span>
                                                <strong>{totalPrice} جنيه</strong>
                                            </span>
                                        </li>
                                        {rival > 0 &&
                                            <>
                                                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                                    <div>
                                                        <strong>الخصم</strong>
                                                    </div>
                                                    <span>
                                                        <strong>{rival} جنيه</strong>
                                                    </span>
                                                </li>

                                                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                                    <div>
                                                        <strong>السعر بعد الخصم</strong>
                                                    </div>
                                                    <span>
                                                        <strong>{totalDiscount} جنيه</strong>
                                                    </span>
                                                </li>
                                            </>
                                        }

                                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                            <strong>الجوال</strong>
                                            <div>
                                                <div>
                                                    <TextField dir="ltr"
                                                        inputProps={{ min: 0, style: { paddingInline: "10px", textAlign: 'center' } }}
                                                        id="outlined-basic"
                                                        variant="standard"
                                                        value={phoneNumber}
                                                        onChange={(e) => {
                                                            const regex = /^[0-9]+$/;
                                                            if ((e.target.value === '' || regex.test(e.target.value)) && e.target.value.length <= 11) {
                                                                setPhoneNumber(e.target.value);
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                <div style={{
                                                    position: "absolute",
                                                    left: "0px",
                                                    marginTop: "5px"
                                                }}>
                                                    {isPhoneVerified ?
                                                        <DoneIcon sx={{ color: 'green', width: "20px" }} />
                                                        :
                                                        <Button variant="contained" onClick={() => {
                                                            if (phoneNumber.slice(0, 2) != "01" || phoneNumber.length < 11) {
                                                                toast("يجب ان يبدا ب 01 ويتكون من 11 رقم")
                                                            } else {
                                                                const data = {
                                                                    "phone": phoneNumber,
                                                                }
                                                                axios.post(`${BASEURL}/${addPhone}/${user.id}`, data, AuthorizatioN(token))
                                                                setOpenAlertDialog(true)
                                                            }
                                                        }}
                                                            sx={{
                                                                padding: "0"
                                                            }}
                                                        >تحقق</Button>
                                                    }
                                                </div>
                                            </div>
                                        </li>
                                    </ul>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
            <AlertDialog open={openAlertDialog} setOpen={setOpenAlertDialog}
                user={user} setUser={setUser} cookie={cookie} phoneNumber={phoneNumber} />
            <Toaster
                position="bottom-center"
                reverseOrder={false}
            />
        </div >
    );
}


function AlertDialog(props) {
    const { open, setOpen, user, setUser, cookie, phoneNumber } = props;

    const [loading, setLoading] = useState(false);
    const [isAvailable, setIsAvailable] = useState("hidden");
    const [txtErrorRes, setTxtErrorRes] = useState("");
    const [otp, setOtp] = useState('');
    const handleClose = () => {
        setOpen(false);
        setIsAvailable("hidden")
    };
    const onSubmitEditUser = async () => {
        setLoading(true);

        const data = {
            "otp": otp,
        }

        const fetchUsers = async () => {
            await axios.post(`${BASEURL}/${acceptPhoneNumber}/${user.id}`, data,
                AuthorizatioN(cookie.get("e-commerce")))
                .then((res) => {
                    setLoading(false);
                    setOpen(false);
                    setIsAvailable("hidden");
                    setUser({ ...user, phone: phoneNumber });
                })
                .catch((error) => {
                    if (error.response.data.message.length > 0) {
                        setTxtErrorRes(error.response.data.message);
                        setIsAvailable("visibility");
                        setTimeout(() => {
                            setIsAvailable("hidden");
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
                {/* <DialogTitle id="alert-dialog-title">{"Verify code send Whatsapp to " + phoneNumber}</DialogTitle> */}
                <DialogTitle id="alert-dialog-title">
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px"
                    }}>
                        <img
                            style={{
                                position: "relative",
                                top: "0px",
                                left: "13px",
                            }}
                            src={require("./../../../assets/images/whatsapp.png")} width={"50px"} height={"50px"} />
                        <NetworkLockedIcon style={{
                            position: "relative",
                            bottom: "-15px",
                            left: "-12px",
                            width: "30px",
                            height: "30px"
                        }} />
                    </div>

                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description" >
                        <div className='d-flex flex-column'>
                            <MuiOtpInput
                                length={4}
                                TextFieldsProps={{ size: 'small' }}
                                sx={{
                                    width: "100%",
                                    maxWidth: "300px",
                                    marginTop: "20px",
                                    marginInline: "1px",
                                }}
                                value={otp}
                                onChange={setOtp} />

                            <Alert sx={{ visibility: isAvailable, marginTop: "10px" }} severity="warning">{txtErrorRes}</Alert>
                        </div>
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} sx={{
                        textTransform: 'none'
                    }}>Disagree</Button>
                    <LoadingButton
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
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
