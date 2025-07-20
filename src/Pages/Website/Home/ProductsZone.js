import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import ProductCard from "../../../Components/Website/ProductCard";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export default function ProductsZone({ products, isLoading }) {
    const breakpoints = {
        300: {
            slidesPerView: 1,
        },
        500: {
            slidesPerView: 2,
        },
        700: {
            slidesPerView: 2,
        },
        900: {
            slidesPerView: 3,
        },
        1100: {
            slidesPerView: 4,
        }
    };


    const getCurrentBreakpoint = () => {
        const screenWidth = window.innerWidth;
        let currentBreakpoint;

        Object.keys(breakpoints).forEach((breakpoint) => {
            if (screenWidth >= breakpoint) {
                currentBreakpoint = breakpoint;
            }
        });
        return currentBreakpoint;
    };


    const [maxSlidesPerView, setMaxSlidesPerView] = useState(0);
    useEffect(() => {
        const currentBreakpoint = getCurrentBreakpoint();
        setMaxSlidesPerView(breakpoints[currentBreakpoint].slidesPerView)
    }, [])

    return (
        <div className='container' style={{
            cursor: "pointer",
            backgroundColor: "rgba(131, 131, 131, 0.2)",
            boxShadow: "2px 2px 4px gray",
            userSelect: "none",
        }}>
            <Swiper
                breakpoints={breakpoints}
                spaceBetween={10}
                centeredSlides={true}
                autoplay={{
                    delay: 1000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                loop={products.length >= maxSlidesPerView} // Disable loop mode if not enough products
                pagination={{
                    clickable: true
                }}
                navigation={true}
                modules={[Pagination, Navigation, ...(products.length >= maxSlidesPerView ? [Autoplay] : [])]}
                className="mySwiper"
            >
                {isLoading
                    ? <Skeleton count={1} inline={true} height={"300px"} />
                    : products.map((product, index) =>
                        <SwiperSlide key={product.id}><ProductCard product={product} /></SwiperSlide>
                    )}

            </Swiper >
        </div >
    )
}