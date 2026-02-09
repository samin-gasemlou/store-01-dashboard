import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Dashboard from './components/pages/Dashboard.jsx';
import Products from './components/pages/Products.jsx';
import AddProduct from './components/pages/AddProduct.jsx';
import Categories from './components/pages/Categories.jsx';
import Brands from './components/pages/Brands.jsx';
import Orders from './components/pages/Orders.jsx';
import Report from './components/pages/Report.jsx';
import Users from './components/pages/Users.jsx';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/products/categories" element={<Categories />} />
        <Route path="/products/brands" element={<Brands />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/users" element={<Users />} />
    </Routes>
  </BrowserRouter>,
)
