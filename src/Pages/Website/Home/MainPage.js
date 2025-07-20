import React, { useContext, useEffect, useState, useRef } from "react";
// import ContextCategories
import { CategoriesContext } from "../../../Context/ContextCategories";
import { ProductsContext } from "../../../Context/ContextProducts";

import CarouselBar from "./CarouselBar";
import ProductsZone from "./ProductsZone";
import Footer from "../Footer/Footer";

export default function MainPage() {
    const productsContext = useContext(ProductsContext);
    const { products, productsOffer, productsLatestSale, productsLatest,
        isLoadingProducts, isLoadingOffer, isLoadingLatestSale, isLoadingLatest
    } = productsContext;


    return (
        <>

            <CarouselBar />

            <div className="container fw-bold mb-3">Latest products</div>
            <ProductsZone products={productsLatest} isLoading={isLoadingLatest} />

            <div className="container fw-bold my-3">Discount</div>
            <ProductsZone products={productsOffer} isLoading={isLoadingOffer} />


        </>
    );
}
