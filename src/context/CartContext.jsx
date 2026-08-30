import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (book) => {
    setCart((currentCart) => {
      const existingBook = currentCart.find(
        (item) => item._id === book._id
      );

      let updatedCart;

      if (existingBook) {
        updatedCart = currentCart.map((item) =>
          item._id === book._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      } else {
        updatedCart = [
          ...currentCart,
          {
            ...book,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const removeFromCart = (bookId) => {
    setCart((currentCart) => {
      const updatedCart = currentCart.filter(
        (item) => item._id !== bookId
      );

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity < 1) {
      removeFromCart(bookId);
      return;
    }

    setCart((currentCart) => {
      const updatedCart = currentCart.map((item) =>
        item._id === bookId
          ? {
              ...item,
              quantity,
            }
          : item
      );

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}