import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Alert, Box } from '@mui/material';
import { CurrentUserContext } from "../../Context/ContextCurrentUser";
import { AuthorizatioN, addToCart as addToCartFromAPI, BASEURL, currentUserCart } from '../../Api/Api';
import Cookie from 'cookie-universal';
import axios from 'axios';
import { CurrentUserCartContext } from '../../Context/ContextCurrentUserCart';

import AlertInfo from '../AlertInfo';

export default function ({ product }) {
    const cookie = Cookie();
    const token = cookie.get("e-commerce");
    const currentUserContext = React.useContext(CurrentUserContext);
    const currentUserId = currentUserContext && currentUserContext.user ? currentUserContext.user.id : undefined;
    const currentUserCartContext = React.useContext(CurrentUserCartContext);
    const { cart, setCart, setIsLoadCart, setLength } = currentUserCartContext;

    const [isOffer, setIsOffer] = React.useState(product.discount > 0);
    const [rating, setRating] = React.useState(product.rating);

    function addToCart(userId, ProductId) {
        const form = new FormData();
        form.append("user_id", userId);
        form.append("product_id", ProductId);


        const setRequest = async () => {
            await axios.post(`${BASEURL}/${addToCartFromAPI}`, form, AuthorizatioN(token));
        }
        if (currentUserId != undefined) {

            const existingProductInCart = cart.find((item) => item.product_id === ProductId);
            if (existingProductInCart) {
                if (existingProductInCart.quantity >= 5) {
                    AlertInfo("لا يمكنك إضافة أكثر من 5 عناصر من نفس المنتج إلى سلة التسوق")
                } else {
                    existingProductInCart.quantity++;
                }
            } else {
                // Product is not in cart, add it with quantity 1
                if (currentUserContext.user.length !== 0) {
                    async function getCurrentUserCart() {
                        await axios.get(`${BASEURL}/${currentUserCart}/${currentUserContext.user.id}`, AuthorizatioN(token))
                            .then((data) => {
                                setCart(data.data.response);
                                setIsLoadCart(false);
                                setLength(data.data.response.length)
                            })
                            .catch((error) => {
                                console.log(error);
                                setIsLoadCart(false);
                            })
                            .finally(() => {
                                setIsLoadCart(false);
                            });
                    }
                    getCurrentUserCart();
                }
                setRequest();
            }

        } else {
            console.log(currentUserId);
        }
    }

    return (
        <div className='div-card-product'
            style={{
                width: 200, height: 300, position: "relative", marginTop: "15px", marginBottom: "15px",
            }}>
            <CustomImage isOffer={isOffer} />
            <Card className='card-product'>
                <CardHeader
                    style={{ paddingRight: "10px", backGroundColor: "gray" }}
                    titleTypographyProps={{ fontSize: 13, height: "25px" }} title={product.title} />

                <div className="position-relative">
                    <PercentageOffer price={product.price} discount={product.discount} isOffer={isOffer} />
                    <CardMedia
                        className='card-media-product'
                        component="img"
                        height="150px"
                        width="200px"
                        sx={{
                            display: "block",
                            objectFit: "cover", padding: "13px", '&:hover': { padding: "0px" }
                        }}
                        image={product.images.length > 0 && product.images[0].image !== undefined ? product.images[0].image : ''}
                        alt="Paella dish" />
                </div>

                <CardPrice price={product.price} discount={product.discount} isOffer={isOffer} />
                <CardActions key={product.id} className='d-flex justify-content-between'>
                    <div>
                        <IconButton >
                            <StarIcon />
                        </IconButton>
                        {[0, 1, 2, 3, 4].map((index) =>
                            rating > index
                                ? <StarIcon style={{ fontSize: "15px" }} key={`star-icon-${index}`} />
                                : <StarBorderIcon style={{ fontSize: "15px" }} key={`star-border-icon-${index}`} />
                        )}

                    </div>
                    <IconButton onClick={() => addToCart(currentUserContext.user.id, product.id)} >
                        <AddShoppingCartIcon />
                    </IconButton>
                </CardActions>
            </Card >

        </div>

    );
}

function CustomImage({ isOffer }) {
    return (
        isOffer &&
        <CardMedia style={{ position: "absolute", top: "-7.8px", right: "-7.5px", width: 70, height: 70, zIndex: 1000 }}
            component="img"
            image={require('../../assets/images/offer.png')}
        />
    )
}

function CardPrice({ price, discount, isOffer }) {

    return (
        <div className="d-flex" dir='rtl'>
            <div
                style={{
                    textDecoration: isOffer && "line-through",
                    color: isOffer && "gray"
                }}
                className='mx-2'>{price} جنية</div>
            {isOffer && <div className='mx-2'>{discount} جنية</div>}

        </div>
    )
}

function PercentageOffer({ price, discount, isOffer }) {
    return (
        isOffer &&
        <Box
            sx={{
                userSelect: "none",
                boxShadow: "1px 1px 3px rgba(0, 0, 0, 1)",
                position: "absolute",
                top: "5%",
                left: "10%",
                width: 40,
                height: 40,
                borderRadius: '100%',
                bgcolor: '#9C27B0',
                color: "white",
                fontSize: "13px", fontWeight: "bold",
            }}
        >
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }}>-{(100 - (discount / price * 100)).toFixed(0)}%</div>
        </Box>
    )
}