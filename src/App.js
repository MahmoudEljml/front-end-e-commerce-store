import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/Website/Home/HomePage.js';

import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import GoogleCallBack from './Pages/Auth/GoogleCallBack';
// Dashboard
import Dashboard from './Pages/Dashboard/Dashboard';
import Main from './Pages/Dashboard/Main';
import CartPage from './Pages/Website/User/CartPage.js';
// Users
import Users from './Pages/Dashboard/Users/Users';
import CreateNewUser from './Pages/Dashboard/Users/CreateNewUser';
// Categories
import Categories from './Pages/Dashboard/Categories/Categories.js';
import CategoriesLisVtView from './Pages/Dashboard/Categories/CategoriesListView.js';
import AddCategory from './Pages/Dashboard/Categories/AddCategory.js';
import Category from './Pages/Dashboard/Categories/Category';
// Merge
import Merges from './Pages/Dashboard/Merge/Merges.js';
import AddEditMerge from './Pages/Dashboard/Merge/AddEditMerge.js';

// Products
import Products from './Pages/Dashboard/Products/Products';
import ProductsListView from './Pages/Dashboard/Products/ProductsListView';
import AddProduct from './Pages/Dashboard/Products/AddProduct';
import EditProduct from './Pages/Dashboard/Products/EditProduct.js';
// Settings DashBoard
import HomePageSettings from './Pages/Dashboard/Settings/HomePageSettings.js';

// context
import ContextDashboard from './Context/ContextDashboard';
import ContextCategories from './Context/ContextCategories';
import ContextProducts from './Context/ContextProducts';
import ContextCurrentUser from './Context/ContextCurrentUser.js';
import ContextCurrentUserCart from './Context/ContextCurrentUserCart.js';
import CarouselSettings from './Pages/Dashboard/Settings/CarouselSetting.js';
import ContextUsers from './Context/ContextUsers.js';
// 
import RequireAuth from './Pages/Auth/RequireAuth';
import RequireBack from './Pages/Auth/RequireBack';
import Error_403 from './Pages/Auth/403';
import ContextMerges from './Context/ContextMerges.js';
import CategoriesSelect from './Pages/Website/CategoriesSelect.js';
import MainPage from './Pages/Website/Home/MainPage.js';




function App() {
  return (
    <div className="App">


      <ContextMerges>
        <ContextCategories>
          <ContextProducts>
            <ContextCurrentUser>

              <Routes>

                <Route path='/auth/google/callback/' element={<GoogleCallBack />} />
                <Route element={<RequireBack />}>
                  <Route path='/login' element={<Login />} />
                  <Route path='/register' element={<Register />} />
                </Route>


                <Route path='/*' element={<div>page not exist</div>} />
                <Route path='' element=
                  {
                    <ContextCurrentUserCart>
                      <HomePage />
                    </ContextCurrentUserCart>
                  } >
                  <Route index element={<MainPage />} />
                  <Route path='categories/:id' element={<CategoriesSelect />} />
                  <Route path="/cart" element={<CartPage />} />
                </Route>



                <Route element={<RequireAuth allowedRole={["Admin", "Data entry"]} />}>

                  <Route path="dashboard" element=
                    {

                      <ContextDashboard>
                        <ContextUsers>
                          <Dashboard />
                        </ContextUsers>
                      </ContextDashboard>

                    }>

                    <Route element={<RequireAuth allowedRole={["Admin"]} />}  >
                      <Route path="main" element={<Main />} />
                      <Route path="users" element={< Users />} />
                      <Route path="createNewUser" element={< CreateNewUser />} />
                    </Route>
                    <Route element={<RequireAuth allowedRole={["Admin"]} />}  >
                      <Route path="categories" element={<Categories />} >
                        <Route path="list" element={<CategoriesLisVtView />} />
                        <Route path="add" element={<AddCategory />} />
                        <Route path="list/:id" element={<Category />} />
                      </Route>
                      <Route path='merges' element={<Outlet />} >
                        <Route path='' element={<Merges />} />
                        <Route path='add' element={<AddEditMerge />} />
                        <Route path=':id' element={<AddEditMerge />} />
                      </Route>

                      <Route path="products" element={<Products />} >
                        <Route path="list" element={<ProductsListView />} />
                        <Route path="add" element={<AddProduct />} />
                        <Route path="list/:id" element={<EditProduct />} />
                      </Route>

                      <Route path="settings/homePage" element={<HomePageSettings />} />
                      <Route path="settings/carousel" element={<CarouselSettings />} />
                    </Route>
                  </Route>

                </Route>


              </Routes>

            </ContextCurrentUser>
          </ContextProducts>
        </ContextCategories>
      </ContextMerges>


    </div>
  );
}

export default App;
