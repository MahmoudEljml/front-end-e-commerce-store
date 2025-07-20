import { Button } from "react-bootstrap";
import Cookies from 'cookie-universal';
import axios from "axios";
import { AuthorizatioN, BASEURL, LOGOUT } from "../../Api/Api";


export default function Logout() {
    const cookie = Cookies()
    const token = cookie.get("e-commerce");

    async function handleLogout() {
        try {
            const response = await axios.get(`${BASEURL}/${LOGOUT}`, AuthorizatioN(token))
                .then(() => {
                    console.log("log out success");
                    cookie.remove("e-commerce");
                    window.location.reload();
                });
        } catch (error) {
            console.log("error log out:     ", error.response);
        }
    }
    handleLogout();
}
