import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { BASEURL, Latest, LatestSale, PRODUCTS } from "../Api/Api";

export const ProductsContext = createContext(true);

export default function ({ children }) {

    const [products, setProducts] = useState([]);
    const [productsOffer, setProductsOffer] = useState([]);
    const [productsLatestSale, setProductsLatestSale] = useState([]);
    const [productsLatest, setProductsLatest] = useState([]);

    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isLoadingOffer, setIsLoadingOffer] = useState(true);
    const [isLoadingLatestSale, setIsLoadingLatestSale] = useState(true);
    const [isLoadingLatest, setIsLoadingLatest] = useState(true);

    useEffect(() => {
        const getProducts = async () => {
            await axios.get(`${BASEURL}/${PRODUCTS}`)
                .then((data) => {
                    setProducts(data.data);
                    setIsLoadingProducts(false);
                    setProductsOffer(data.data.filter((pro) => pro.discount > 0));
                    setIsLoadingOffer(false);
                })
                .catch((error) => console.log("contextPage error:" + error))
                .finally(() => {
                    setIsLoadingProducts(false);
                    setIsLoadingOffer(false);
                });
            await axios.get(`${BASEURL}/${LatestSale}`)
                .then((data) => {
                    setProductsLatestSale(data.data);
                    setIsLoadingLatestSale(false);
                })
                .catch((error) => console.log("contextPage error:" + error))
                .finally(() => setIsLoadingLatestSale(false));
            await axios.get(`${BASEURL}/${Latest}`)
                .then((data) => {
                    setProductsLatest(data.data);
                    setIsLoadingLatest(false);
                })
                .catch((error) => console.log("contextPage error:" + error))
                .finally(() => setIsLoadingLatest(false));
        }
        getProducts();
    }, [])
    return (
        <ProductsContext.Provider value={{
            products, productsOffer, productsLatestSale, productsLatest,
            isLoadingProducts, isLoadingOffer, isLoadingLatestSale, isLoadingLatest,
        }}>
            {children}
        </ProductsContext.Provider>
    );
}