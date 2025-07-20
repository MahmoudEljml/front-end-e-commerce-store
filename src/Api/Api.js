import axios from "axios";

export const BASEURL = "http://127.0.0.1:8000/api";
// export const BASEURL = "https://e-commerce-xi-umber.vercel.app/api/api";
// export const BASEURL = "https://laravel-app-alpha.vercel.app/api/api";
// export const BASEURL = "http://mahmoud-elgamal.atwebpages.com/api";
// export const BASEURL = "https://mahmoud-elgamal.infinityfreeapp.com/api";
export const REGISTER = "register";
export const LOGIN = "login";
export const USERS = "users";
export const LOGOUT = "logout";
export const USER = "user";
export const USER_EDIT = "user/edit";

export const GOOGLE_CALL_BACK = "auth/google/callback"
export const LOGIN_WITH_GOOGLE = "login-google";

export const ADD_NEW_USER = "user/add";

export const CAT = "categories";
export const Add_CAT = "category/add";
export const DELETE_CAT = "category";
export const GET_CAT = "category";
export const EDIT_CAT = "category/edit";

export const PRODUCTS = "products";
export const PRODUCT = "product";
export const ADD_PRODUCT = "product/add";
export const PRODUCTS_EDIT = "product/edit";
export const ADD_PRODUCT_IMAGES = "product-img/add";

export const LatestSale = "latest-sale";
export const Latest = "latest";
export const getProductsByIdCategory = "products-by-id-category";

export const AllMerge = "allMerges";
export const GetMerge = "merges";
export const AddMerge = "merges/add";
export const EditMergE = "merges/edit";
export const DeleteMerge = "merges/delete";

export const BaseAddCarouselImage = "setting/carouselAddImage";
export const BaseCarouselEditDescription = "setting/carouselEditDescription";
export const BaseDeleteCarouselImage = "setting/carouselDeleteImage";
export const BaseGetCarouselImages = "setting/carouselGetImages";

export const addToCart = "addToCart";
export const removeFromCart = "removeFromCart";
export const deleteFromCart = "deleteFromCart";
export const currentUserCart = "currentUserCart";
export const addPhone = "addPhone";
export const acceptPhoneNumber = "acceptPhoneNumber";

export function AuthorizatioN(token) { return ({ headers: { Authorization: 'Bearer ' + token } }); };

export function getCategoriesPaginate(limit, number_page) {
    const params = { limit: limit, number_page: number_page, }
    return axios.get(`${BASEURL}/get-categories-paginate`, { params })
        .then(response => response.data.data)
}
