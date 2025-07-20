import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthorizatioN, currentUserCart, BASEURL } from "../Api/Api";
import Cookie from 'cookie-universal';
import { CurrentUserContext } from "./ContextCurrentUser";

export const CurrentUserCartContext = createContext(true);

export default function ({ children }) {
    const cookie = Cookie();
    const token = cookie.get("e-commerce");
    const currentUserContext = useContext(CurrentUserContext);
    const { user, isLoad } = currentUserContext;

    const [cart, setCart] = useState([]);
    const [length, setLength] = useState(0);

    const [isLoadCart, setIsLoadCart] = useState(true);
    useEffect(() => {
        if (user.length !== 0) {
            async function getCurrentUserCart() {
                await axios.get(`${BASEURL}/${currentUserCart}/${user.id}`, AuthorizatioN(token))
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
    }, [user])

    useEffect(() => {
        setLength(cart.length);
        console.log(cart)
    }, [cart])

    return (
        <CurrentUserCartContext.Provider value={{ cart, setCart, isLoadCart, setIsLoadCart, length, setLength }}> {children} </CurrentUserCartContext.Provider>
    );
}