import axios from "axios";
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import { BASEURL, getProductsByIdCategory } from "../../Api/Api";
import ProductCard from "../../Components/Website/ProductCard";
import ProductsZone from "./Home/ProductsZone";


export default function () {
    const location = useLocation();
    
    const id = Number(location.pathname.replace("/categories/", ""));
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get(`${BASEURL}/${getProductsByIdCategory}/${id}`)
            .then((data) => {
                setProducts(data.data);
                // console.log(data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [location])



    return (
        <>
            <div className="container fw-bold mb-3">{products.title}</div>
            <ProductsZone products={products} isLoading={false} />
        </>

    )
}