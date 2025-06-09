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
      fetchCart(); // Fetch cart when token is available
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setCart(null); // Clear cart on logout
    }
  }, [token]);

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
        logout,
        backendUrl,
        cart,
        fetchCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
