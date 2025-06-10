import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

const HomePage = lazy(() => import("./components/HomePage"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const NavBar = lazy(() => import("./components/NavBar"));
const Footer = lazy(() => import("./components/Footer"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const Products = lazy(() => import("./components/Products"));
const ContactUs = lazy(() => import("./components/ContactUs"));
const Cart = lazy(() => import("./components/Cart"));
const Profile = lazy(() => import("./components/Profile"));
const Order = lazy(() => import("./components/Order"));
const ProductDetails = lazy(() => import("./components/ProductDetails"));

const AppWrapper = () => {
  const location = useLocation();
  const hideNavBarAndFooter =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {!hideNavBarAndFooter && <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/product" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/productdetails/:id" element={<ProductDetails />} />
      </Routes>
      {!hideNavBarAndFooter && <Footer />}
    </Suspense>
  );
};

const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;
