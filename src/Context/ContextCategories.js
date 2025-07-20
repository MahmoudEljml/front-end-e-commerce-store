import { createContext, useEffect, useState } from "react";
import { BASEURL, CAT, getCategoriesPaginate } from "../Api/Api";
import axios from "axios";


export const CategoriesContext = createContext(true);


export default function ({ children }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get(`${BASEURL}/${CAT}`)
            .then(data => {
                setCategories(data.data);
            })
            .catch(error => {
                console.error(error);
            });
        // getCategoriesPaginate(2, 5).then(result => console.log(result));

    }, []);

    return (
        <CategoriesContext.Provider value={{ categories, setCategories }}>
            {children}
        </CategoriesContext.Provider>
    );
}