import { createContext, useContext, useEffect, useState } from "react";
import { NavCategories, NavLinks, NavProducts, NavSettings } from "../Pages/Dashboard/Tree";
export const DashboardContext = createContext(true);

export default function ({ children }) {
    const [isOpen, setIsOpen] = useState(true);
    const [path, setPath] = useState("/");
    const [selectedItemSideBar, setSelectedItemSideBar] = useState(0);
    useEffect(() => {
        const path = window.location.pathname;
        const allListLinks = NavLinks.concat(NavCategories).concat(NavProducts).concat(NavSettings);
        const index = allListLinks.map((item) => item.to).indexOf(path);
        setSelectedItemSideBar(index);
    }, [path])
    return (
        <DashboardContext.Provider value={{
            isOpen, setIsOpen,
            selectedItemSideBar, setSelectedItemSideBar, path, setPath,
            NavLinks, NavCategories, NavProducts, NavSettings
        }}> {children} </DashboardContext.Provider>
    );
}
