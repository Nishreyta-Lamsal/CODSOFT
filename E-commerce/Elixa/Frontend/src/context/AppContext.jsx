import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [cart, setCart] = useState(null);
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      fetchUserData();
      fetchCart();
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
      setCart(null);
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      if (!token) return;
      const response = await fetch(`${backendUrl}/api/user/get-profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
        console.error("Failed to fetch user data:", data.message);
      }
    } catch (err) {
      console.error("Fetch user data error:", err);
      setUser(null);
    }
  };

  const fetchCart = async () => {
    try {
      if (!token) return;
      const response = await fetch(`${backendUrl}/api/user/cart-view`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
      } else {
        setCart(null);
      }
    } catch (err) {
      console.error("Fetch cart error:", err);
      setCart(null);
    }
  };

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCart(null);
    localStorage.removeItem("token");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        setUser,
        logout,
        backendUrl,
        cart,
        fetchCart,
        fetchUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
