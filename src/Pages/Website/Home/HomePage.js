import React, { useContext, useEffect, useState, useRef } from "react";
import Navbar from "../Navbar";
import { Fab, IconButton } from "@mui/material";
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";

export default function HomePage() {

    return (
        <>
            <Navbar />

            <div style={{ paddingTop: "63px" }}>
                <Outlet />
            </div>



            {/* <Footer /> */}

            <FabGoTop />

        </>
    );
}

function FabGoTop() {
    const [showFab, setShowFab] = useState(false);
    function handleScroll() {
        if (window.scrollY > 200) {
            setShowFab(true);
        } else {
            setShowFab(false);
        }
    }

    function goToTopPage() {
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        showFab && (
            <Fab
                sx={{
                    color: 'primary',
                    label: 'Expand',
                    position: "fixed",
                    bottom: "30px",
                    right: "30px",
                }}
                onClick={goToTopPage}
            >
                <UpIcon sx={{ width: "50px", height: "50px" }} />
            </Fab>
        )
    );
}