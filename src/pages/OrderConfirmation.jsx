import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './OrderConfirmation.css'; // We'll add some styles

const OrderConfirmationPage = () => {
    // This hook gets the data that was passed from the PaymentPage
    const location = useLocation();
    const { order } = location.state || {}; // Safely get the order object

    // If for some reason the page was loaded without order data, show an error
    if (!order) {
        return (
            <div className="confirmation-container">
                <h2>Error</h2>
                <p>No order details found. Your order may have still been placed.</p>
                <Link to="/orders">
                    <button className="confirmation-button">Check My Orders</button>
                </Link>
            </div>
        );
    }

    // This is the main success message display
    return (
        <div className="confirmation-container">
            <h2 className="success-message">✅ Order Placed Successfully!</h2>
            <p>Your order #{order.id} for {order.items.length} item(s) has been placed.</p>
            
            <div className="order-details">
                <p>It will be delivered to: <strong>{order.deliveryAddress}</strong></p> <br />
                <p>Estimated Delivery Time: <strong>{order.estimatedDeliveryTime}</strong></p> <br />
                <p>Payment Method: <strong>{order.paymentMethod}</strong></p>
            </div>
            
            <Link to="/home">
                <button className="confirmation-button">
                    ← Back to Home
                </button>
            </Link>
        </div>
    );
};

export default OrderConfirmationPage;