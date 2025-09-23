import React from 'react';
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, addToCart, removeFromCart, clearCart, removeItemFromCart } = useCart();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePlaceOrder = () => {
        const orderData = {
            total: subtotal,
            items: cartItems
        };
        navigate('/payment', { state: { order: orderData } });
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-container empty">
                    <h2>Your Cart is Empty.</h2>
                    <button className="cart-action-btn back" onClick={() => navigate("/home")}>
                        ← Back to Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <h2 className="cart-title">🛒 Your Cart</h2>
                <div className="cart-items-list">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            {/*<img src={item.image} alt={item.name} className="cart-item-image" />*/}
                            <img src={process.env.PUBLIC_URL + item.image} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-info">
                                <h3>{item.name}</h3>
                                <p>{item.restaurant}, {item.address}</p>
                                <div className="quantity-controls">
                                    <button className="qty-btn" onClick={() => removeFromCart(item)}>−</button>
                                    <span className="qty-display">{item.quantity}</span>
                                    <button className="qty-btn" onClick={() => addToCart(item)}>+</button>
                                </div>
                                <p className="cart-item-price">₹{item.price.toFixed(2)}</p>
                            </div>
                            <button className="remove-btn" onClick={() => removeItemFromCart(item)}>❌ Remove</button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h3 className="cart-total">Total: ₹{subtotal.toFixed(2)}</h3>
                    <div className="cart-actions">
                        <button className="cart-action-btn back" onClick={() => navigate('/home')}>← Back to Home</button>
                        <button className="cart-action-btn clear" onClick={clearCart}>🗑️ Clear Cart</button>
                        <button className="cart-action-btn place-order" onClick={handlePlaceOrder}>✅ Place Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;