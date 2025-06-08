import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import AboutUs from "./components/AboutUs";
import Products from "./components/Products";
import ContactUs from "./components/ContactUs";
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import Order from "./components/Order";

// Wrapper component to conditionally show NavBar and Footer
const AppWrapper = () => {
  const location = useLocation();
  const hideNavBarAndFooter =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
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
      </Routes>
      {!hideNavBarAndFooter && <Footer />}
    </>
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
