import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import './OrderTracking.css';

const steps = ["Order Placed", "Order Accepted", "Preparing Food", "Out for Delivery", "Delivered"];

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This function fetches the latest order status from the backend
        const fetchOrder = async () => {
            let endpoint = '';
            if (orderId) {
                endpoint = `/orders/${orderId}`;
            } else if (currentUser) {
                endpoint = `/orders/user/${currentUser.id}/latest-active`;
            } else {
                setLoading(false);
                return; 
            }

            try {
                const response = await apiClient.get(endpoint);
                setOrder(response.data);
            } catch (error) {
                console.error("Failed to fetch order:", error);
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder(); // Fetch immediately when the page loads
        
        // Then, set up a timer to re-fetch the status every 1 second
        const interval = setInterval(fetchOrder, 1000);

        // Clean up the timer when the user leaves the page to prevent memory leaks
        return () => clearInterval(interval);

    }, [orderId, currentUser]);


    if (loading) return <div className="tracking-page"><p>Loading order details...</p></div>;
    if (!order) return <div className="tracking-page"><p>No active order found.</p></div>;

    // Calculate the current step based on the status from the backend
    const currentStepIndex = steps.indexOf(order.status);

    return (
        <div className="tracking-page">
            <div className="tracking-card">
                <div className="tracking-header">
                    <h2>🚚 Order Tracking for Order #{order.id}</h2>
                </div>

                <div className="order-details-summary">
                    <p><strong>Placed On:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p><strong>Placed At:</strong> {new Date(order.orderDate).toLocaleTimeString()}</p>
                    <p><strong>Address:</strong> {order.deliveryAddress}</p>
                    <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                    <div>
                        <strong>Items:</strong>
                        {order.items.map(item => (
                            <div key={item.id} className="item-detail">
                                <span>• <strong>{item.menuItemName}</strong> x <strong>{item.quantity}</strong></span>
                                <span>₹{(item.pricePerItem * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="tracking-steps">
                    {steps.map((step, index) => (
                        <div key={index} className={`tracking-step ${index <= currentStepIndex ? 'completed' : ''}`}>
                            <div className="step-icon">{index <= currentStepIndex ? '✅' : '⏳'}</div>
                            <div className="step-name">{step}</div>
                        </div>
                    ))}
                </div>

                <div className="tracking-buttons">
                    <button className="button" onClick={() => navigate("/orders")}>View My Orders</button>
                    <button className="button green" onClick={() => navigate("/home")}>Back to Home</button>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;