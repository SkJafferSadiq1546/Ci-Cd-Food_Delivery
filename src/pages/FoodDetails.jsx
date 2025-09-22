import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './FoodDetails.css';

const FoodDetails = () => {
    const { id } = useParams();
    const [foodItem, setFoodItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFoodItem = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/api/menu-items/${id}`);
                setFoodItem(response.data);
            } catch (error) {
                console.error("Failed to fetch food item details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFoodItem();
    }, [id]);

    // ✅ THIS FUNCTION IS NOW CORRECTED
    const handlePlaceOrder = () => {
        // 1. Create an 'order' object in the correct format
        const orderData = {
            total: foodItem.price, // Use the 'total' key
            items: [{ ...foodItem, quantity: 1 }] // Put the item in an array
        };
        
        // 2. Pass the 'orderData' inside a state key named 'order'
        navigate('/payment', { state: { order: orderData } });
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!foodItem) {
        return <div className="not-found">Food item not found.</div>;
    }

    return (
        <div className="food-details-container">
            <div className="food-details-card">
                <img src={foodItem.image} alt={foodItem.name} className="food-details-img" />
                <h1 className="food-details-name">{foodItem.name}</h1>
                <p className="food-details-price">Price: ₹{foodItem.price}</p>
                <p className="food-details-info">Restaurant: {foodItem.restaurant}</p>
                <p className="food-details-info">Address: {foodItem.address}</p>
                <p className="food-details-rating">⭐ {foodItem.rating}</p>
                <button className="place-order-btn" onClick={handlePlaceOrder}>
                    ✅ Place Order
                </button>
                <div className="footer-nav">
                    <Link to="/home" className="back-home-button">
                     ← Go Back
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FoodDetails;