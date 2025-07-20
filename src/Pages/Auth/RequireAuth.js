
import axios from "axios";
import Cookie from "cookie-universal";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { AuthorizatioN, BASEURL, USER } from "../../Api/Api";
import { Loading1 } from '../../Components/Loading';
import Error_403 from "./403";

export default function RequireAuth({ allowedRole }) {
    const cookie = Cookie();
    const token = cookie.get("e-commerce");
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    useEffect(() => {
        
        axios.get(`${BASEURL}/${USER}`, AuthorizatioN(token))
            .then((data) => setUser(data.data))
            .catch(() => navigate("/login", { replace: true }));
    }, []);

    return token ? (
        user === "" ? (
            <Loading1 />
        ) : allowedRole.includes(user.role) ? (
            <Outlet />
        ) : (
            < Error_403 />
        )
    ) : (
        <Navigate to={"/login"} replace={true} />
    );
}
