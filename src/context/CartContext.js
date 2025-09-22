import React, { createContext, useState, useEffect, useContext } from 'react';
const CartContext = createContext();

// Create a custom hook for easy access
export const useCart = () => {
    return useContext(CartContext);
};

// Create the Provider component
export const CartProvider = ({ children }) => {
    // This is our single, global cart state
    const [cartItems, setCartItems] = useState(() => {
        // Load initial cart from localStorage
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save to localStorage whenever the cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        setCartItems(prevItems => {
            const existing = prevItems.find(i => i.id === item.id);
            if (existing) {
                return prevItems.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevItems, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (item) => {
        setCartItems(prevItems => {
            const existing = prevItems.find(i => i.id === item.id);
            if (existing.quantity === 1) {
                return prevItems.filter(i => i.id !== item.id);
            }
            return prevItems.map(i =>
                i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
            );
        });
    };

    const removeItemFromCart = (itemToRemove) => {
        setCartItems(prevItems => 
            prevItems.filter(item => item.id !== itemToRemove.id)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        removeItemFromCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};