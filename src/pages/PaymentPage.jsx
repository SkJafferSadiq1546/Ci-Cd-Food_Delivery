import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';
import { QRCodeCanvas } from 'qrcode.react'; // ✅ Import the QR code component
import './PaymentPage.css';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const { currentUser } = useAuth();
    
    const [paymentMethod, setPaymentMethod] = useState('');
    const [upiApp, setUpiApp] = useState(''); // ✅ New state for selected UPI app
    const [error, setError] = useState('');

    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const handlePayment = async () => {
        if (!paymentMethod) {
            setError("Please select a payment method.");
            return;
        }
        if (cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }
        setError('');

        const finalPaymentMethod = paymentMethod === 'UPI' ? `${upiApp} (UPI)` : 'Cash on Delivery';

        try {
            const deliveryAddress = currentUser?.address || "Guest Order - No Address Provided";
            const orderPayload = {
                userId: currentUser ? currentUser.id : null,
                totalAmount: cartTotal,
                paymentMethod: finalPaymentMethod,
                deliveryAddress: deliveryAddress,
                estimatedDeliveryTime: "30-45 minutes",
                items: cartItems.map(item => ({
                    menuItemId: item.id,
                    quantity: item.quantity,
                    pricePerItem: item.price
                }))
            };

            const response = await apiClient.post('/orders', orderPayload);
            const savedOrder = response.data;
            clearCart();
            
            // Navigate to the order confirmation page, NOT tracking
            navigate('/order-confirmation', { state: { order: savedOrder } });

        } catch (err) {
            console.error("Failed to place order:", err);
            setError("There was an error placing your order. Please try again.");
        }
    };

    if (cartItems.length === 0 && !error) {
        return (
            <div className="payment-container empty">
                <h2>Your Cart is Empty</h2>
                <button onClick={() => navigate('/home')}>Back to Menu</button>
            </div>
        );
    }

    return (
        <div className="payment-container">
            <div className="payment-card">
                <h2>💳 Payment Page</h2>
                <p className="total-amount">Total Amount: ₹{cartTotal.toFixed(2)}</p>
                
                <div className="payment-methods">
                    <h3>Select Payment Method:</h3>
                    <div className="method">
                        <input type="radio" id="upi" name="payment" value="UPI" onChange={(e) => setPaymentMethod(e.target.value)} />
                        <label htmlFor="upi">UPI</label>
                    </div>
                    <div className="method">
                        <input type="radio" id="cod" name="payment" value="Cash on Delivery" onChange={(e) => setPaymentMethod(e.target.value)} />
                        <label htmlFor="cod">Cash on Delivery</label>
                    </div>
                </div>

                {/* ✅ This block will only show if UPI is selected */}
                {paymentMethod === 'UPI' && (
                    <div className="upi-details">
                        <h4>Select UPI App:</h4>
                        <div className="method">
                            <input type="radio" id="gpay" name="upiApp" value="Google Pay" onChange={(e) => setUpiApp(e.target.value)} />
                            <label htmlFor="gpay">Google Pay</label>
                        </div>
                        <div className="method">
                            <input type="radio" id="phonepe" name="upiApp" value="PhonePe" onChange={(e) => setUpiApp(e.target.value)} />
                            <label htmlFor="phonepe">PhonePe</label>
                        </div>

                        {/* ✅ This block will only show if a UPI app is selected */}
                        {upiApp && (
                            <div className="qr-code-container">
                                <h4>⭐ Scan QR with {upiApp}</h4>
                                <QRCodeCanvas
                                    value={`upi://pay?pa=merchant@upi&pn=FoodDelivery&am=${cartTotal.toFixed(2)}`}
                                    size={180}
                                    bgColor={"#ffffff"}
                                    fgColor={"#000000"}
                                    level={"L"}
                                    includeMargin={true}
                                />
                                <p>Amount: ₹{cartTotal.toFixed(2)}</p>
                            </div>
                        )}
                    </div>
                )}

                {error && <p className="error-message">{error}</p>}
                <button className="pay-now-btn" onClick={handlePayment}>Pay Now</button>
            </div>
        </div>
    );
};

export default PaymentPage;