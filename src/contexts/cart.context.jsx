import { createContext, useState, useEffect } from "react";

export const CartContext = createContext({
  isCartOpen: false,
  setIsCartOpen: () => {},
  cartItems: [],
  addItemToCart: () => {},
  cartCount: 0,
  removeItemFromCart: () => {},
  clearItemFromCart: () => {},
  cartTotal: 0,
});

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const newCartTotal = cartItems.reduce(
      (total, currentElement) =>
        total + currentElement.quantity * currentElement.price,
      0
    );
    setCartTotal(newCartTotal);
  }, [cartItems]);

  useEffect(() => {
    const newCartCount = cartItems.reduce(
      (total, currentElement) => total + currentElement.quantity,
      0
    );
    setCartCount(newCartCount);
  }, [cartItems]);

  const clearItemFromCart = (productToClear) => {
    setCartItems((prevValue) => {
      return prevValue.filter((item) => item.id !== productToClear.id);
    });
  };

  const removeItemFromCart = (productToRemove) => {
    setCartItems((prevValue) => {
      const existingCartItem = prevValue.find(
        (item) => item.id === productToRemove.id
      );

      if (existingCartItem.quantity === 1) {
        return prevValue.filter((item) => item.id !== productToRemove.id);
      }

      return prevValue.map((item) => {
        return item.id === productToRemove.id
          ? { ...item, quantity: item.quantity - 1 }
          : { ...item };
      });
    });
  };

  const addItemToCart = (productToAdd) => {
    setCartItems((prevValue) => {
      const existingCartItem = prevValue.find(
        (item) => item.id === productToAdd.id
      );

      if (existingCartItem) {
        return prevValue.map((item) => {
          return item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : { ...item };
        });
      }

      return [...prevValue, { ...productToAdd, quantity: 1 }];
    });
  };

  const value = {
    isCartOpen,
    setIsCartOpen,
    addItemToCart,
    cartItems,
    cartCount,
    removeItemFromCart,
    clearItemFromCart,
    cartTotal,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
