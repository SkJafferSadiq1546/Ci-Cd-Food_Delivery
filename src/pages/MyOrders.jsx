import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import './MyOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!currentUser || !currentUser.id) {
                setLoading(false);
                return;
            }
            try {
                const response = await apiClient.get(`/orders/user/${currentUser.id}`);
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [currentUser]);
    
    const sortedOrders = useMemo(() => {
        return [...orders].sort((a, b) => {
            const dateA = new Date(a.orderDate);
            const dateB = new Date(b.orderDate);
            return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }, [orders, sortBy]);

    // This helper function formats the date and time
    const formatDateTime = (isoString) => {
        if (!isoString) return 'N/A'; // Handle cases where date is null
        const date = new Date(isoString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) return <div className="my-orders-page"><p>Loading your orders...</p></div>;
    if (!currentUser) return <div className="my-orders-page"><p>Please <Link to="/signin">sign in</Link> to see your orders.</p></div>;

    return (
        <div className="my-orders-page">
            <header className="orders-header">
                <h2>📦 My Orders</h2>
                {sortedOrders.length > 0 && (
                    <button className="sort-button" onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}>
                        Sort: {sortBy === 'newest' ? 'Newest → Oldest' : 'Oldest → Newest'}
                    </button>
                )}
            </header>

            {sortedOrders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                sortedOrders.map((order) => (
                    <div key={order.id} className="order-card">
                        <div className="card-header">
                            <div className="order-info">
                                <h3>Order #{order.id}</h3>
                                {order.status !== 'Delivered' && (
                                    <Link to={`/tracking/${order.id}`} className="track-button">
                                        🚚 Track Order
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="card-body">
                            <p><strong>Placed On:</strong> {formatDateTime(order.orderDate)}</p>
                            <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                            <p><strong>Delivered To:</strong> {order.deliveryAddress}</p>
                            <ul className="items-list">
                                {order.items.map((item, index) => (
                                    <li key={index} className="item-detail">
                                        <span>• {item.menuItemName || 'Item not available'} × {item.quantity}</span>
                                        <span>₹{item.pricePerItem.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="card-footer">
                            {order.status === 'Delivered' ? (
                                // ✅ FIX: Use the correct deliveredAt variable
                                <span className="status-badge delivered">✓ Delivered on {formatDateTime(order.deliveredAt)}</span>
                            ) : (
                                <span className="status-badge pending">... Status: {order.status}</span>
                            )}
                        </div>
                        
                    </div>
                ))
            )}
            <div className="footer-nav">
                            <Link to="/home" className="back-home-button">
                            ← Back to Home
                            </Link>
                        </div>
        </div>
    );
};

export default MyOrders;