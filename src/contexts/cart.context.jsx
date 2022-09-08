import { createContext, useReducer } from "react";
import { createAction } from "../utils/reducer/reducer.util";

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

const INITIAL_STATE = {
  isCartOpen: false,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
};

const CART_ACTION_TYPES = {
  SET_CART_ITEMS: "SET_CART_ITEMS",
  SET_IS_CART_OPEN: "SET_IS_CART_OPEN",
};

const cartReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case CART_ACTION_TYPES.SET_CART_ITEMS:
      return {
        ...state,
        ...payload,
      };
    case CART_ACTION_TYPES.SET_IS_CART_OPEN:
      return {
        ...state,
        isCartOpen: payload,
      };
    default:
      throw new Error(`unhandled type of ${type} in cartReducer`);
  }
};

export const CartProvider = ({ children }) => {
  const [{ cartItems, isCartOpen, cartCount, cartTotal }, dispatch] =
    useReducer(cartReducer, INITIAL_STATE);

  const updateCartItemReducer = (newCartItems) => {
    console.log(newCartItems);
    const newCartTotal = newCartItems.reduce(
      (total, currentElement) =>
        total + currentElement.quantity * currentElement.price,
      0
    );
    const newCartCount = newCartItems.reduce(
      (total, currentElement) => total + currentElement.quantity,
      0
    );

    dispatch(
      createAction(CART_ACTION_TYPES.SET_CART_ITEMS, {
        cartItems: newCartItems,
        cartTotal: newCartTotal,
        cartCount: newCartCount,
      })
    );
  };

  const clearItemFromCart = (productToClear) => {
    const newCartItems = cartItems.filter(
      (item) => item.id !== productToClear.id
    );

    updateCartItemReducer(newCartItems);
  };

  const removeItemFromCart = (productToRemove) => {
    const newCartItems = () => {
      const existingCartItem = cartItems.find(
        (item) => item.id === productToRemove.id
      );

      if (existingCartItem.quantity === 1) {
        return cartItems.filter((item) => item.id !== productToRemove.id);
      }

      return cartItems.map((item) => {
        return item.id === productToRemove.id
          ? { ...item, quantity: item.quantity - 1 }
          : { ...item };
      });
    };

    updateCartItemReducer(newCartItems());
  };

  const addItemToCart = (productToAdd) => {
    const newCartItems = () => {
      const existingCartItem = cartItems.find(
        (item) => item.id === productToAdd.id
      );

      if (existingCartItem) {
        return cartItems.map((item) => {
          return item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : { ...item };
        });
      }

      return [...cartItems, { ...productToAdd, quantity: 1 }];
    };

    updateCartItemReducer(newCartItems());
  };

  const setIsCartOpen = (bool) => {
    dispatch(createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, bool));
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
