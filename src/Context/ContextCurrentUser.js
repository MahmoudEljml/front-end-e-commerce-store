import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { AuthorizatioN, BASEURL, USER } from "../Api/Api";
import Cookie from 'cookie-universal';

export const CurrentUserContext = createContext(true);

export default function ({ children }) {
    const cookie = Cookie();
    const token = cookie.get("e-commerce");
    const [user, setUser] = useState([]);
    const [isLoad, setIsLoad] = useState(true);

    useEffect(() => {
        if (token) {
            axios.get(`${BASEURL}/${USER}`, AuthorizatioN(token))
                .then((data) => {
                    setUser(data.data);
                    setIsLoad(false);
                })
                .catch((error) => {
                    console.log(error);
                    setIsLoad(false);
                });

        } else {
            setIsLoad(false);
        }
    }, []);

    // setUser only use in CartPage.js
    return (
        <CurrentUserContext.Provider value={{ user, setUser, isLoad }}> {children} </CurrentUserContext.Provider>
    );
}