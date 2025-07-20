import { createContext, useEffect, useState } from "react";
import { AuthorizatioN, BASEURL, USERS } from "../Api/Api";
import axios from "axios";
import Cookie from 'cookie-universal';

export const UsersContext = createContext(true);

export default function ({ children }) {
    const cookie = Cookie();
    const token = cookie.get("e-commerce")
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (token) {
            axios.get(`${BASEURL}/${USERS}`,
                AuthorizatioN(token))
                .then((data) => { setUsers(data.data); })
                .catch((error) => console.log(error));
        }
    }, []);

    return (
        <UsersContext.Provider value={{ users, setUsers }}>
            {children}
        </UsersContext.Provider>
    );
}