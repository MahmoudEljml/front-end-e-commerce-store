import axios from "axios";
import { useEffect } from "react"
import { BASEURL, GOOGLE_CALL_BACK } from "../../Api/Api";
import { useLocation } from "react-router-dom";
import Cookies from 'cookie-universal';

export default function GoogleCallBack() {
    const cookie = Cookies();
    const location = useLocation();
    useEffect(() => {
        async function GoogleCall() {
            try {
                const response = await axios.get(`${BASEURL}/${GOOGLE_CALL_BACK}${location.search}`);
                const token = response.data.access_token;
                cookie.set("e-commerce", token);
                window.location.pathname = "/";
            } catch (error) {
                console.log("error google call back:     ", error.response);
            }
        }
        GoogleCall();
    }, []);
    return ""
}