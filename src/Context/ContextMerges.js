import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { AllMerge, BASEURL } from "../Api/Api";

export const MergesContext = createContext(true);


export default function ({ children }) {

    const [merges, setMerges] = useState([]);

    useEffect(() => {
        axios.get(`${BASEURL}/${AllMerge}`)
            .then((response) => {
                const mergesData = response.data;
                const mergesWithMergeArray = mergesData.map((merge) => ({
                    id: merge.id,
                    package_name: merge.package_name,
                    merge: JSON.parse(merge.merge)
                }));

                setMerges(mergesWithMergeArray);
            })
            .catch((error) => console.log(error))
    }, [])


    return (
        <MergesContext.Provider value={{ merges, setMerges }}>{children}</MergesContext.Provider>
    )
}
