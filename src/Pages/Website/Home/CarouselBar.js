import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Image } from 'react-bootstrap';
import { Box } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import { BASEURL, BaseGetCarouselImages } from '../../../Api/Api'
import zIndex from '@mui/material/styles/zIndex';
import { Padding } from '@mui/icons-material';

export default function () {

    const imageStyle = {
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",

    };

    const swiperStyle = {
        width: "90%",
        height: "400px",
        margin: "40px auto",
        cursor: "pointer",
        borderRadius: "10px",
    };

    const buttonStyle = {
        position: "absolute",
        width: 30,
        height: 75,
        top: "50%",
        transform: "translateY(-50%)",
        borderRadius: 1,
        backgroundColor: 'black',
        zIndex: 5,
        display: 'flex',
        cursor: "pointer",
        '&:hover': {
            backgroundColor: 'gray',
        },
    };

    const arrowStyle = {
        fontSize: 30,
        color: 'white',
        top: "50%",
        transform: "translateY(-50%)",
        position: "absolute",
    };

    const textStyle = {
        position: "absolute",
        bottom: "7%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1,
        color: "black",
        fontSize: "20px",
        textAlign: "center",
        borderRadius: "10px",
        Padding: "10px"
    }

    const [data, setData] = useState(null);

    useEffect(() => {
        async function getImageCarousel() {
            await axios.get(`${BASEURL}/${BaseGetCarouselImages}`)
                .then((data) => {
                    setData(data.data);
                })
                .catch((error) => console.log(error))
        }
        getImageCarousel();
    }, [])

    return (
        <>
            <Swiper data-swiper-autoplay="2000"
                style={swiperStyle}
                speed={1000}
                autoplay={{ delay: 1500 }}
                loop={true}
                pagination={{ clickable: true }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                modules={[Navigation, Autoplay, Pagination]}
                className="mySwiper"
            >

                <Box sx={{ left: 0, ...buttonStyle, animation: "1s all" }} className="swiper-button-prev box" >
                    <ArrowBackIosNewIcon style={arrowStyle} />
                </Box>
                <Box sx={{ right: 0, ...buttonStyle, }} className="swiper-button-next box" >
                    <ArrowForwardIosIcon style={arrowStyle} />
                </Box>

                {data && data.map((item, index) => {
                    return (
                        <SwiperSlide key={item.id} style={{ height: "auto" }}>
                            <Image style={imageStyle} src={item.url} />
                            <div style={textStyle}>{item.description}</div>
                        </SwiperSlide>
                    )
                })}


            </Swiper>
        </>
    );
}
