import React from "react";
import "./OrderSummary.css";

const OrderSummary = ({ order }) => {
  return (
    <div className="order-container">
      {/* 1. Order Summary */}
      <section className="card">
        <h2>Order Summary</h2>
        <ul className="item-list">
          {order.items.map((item, idx) => (
            <li key={idx} className="item">
              <span>{item.name} {item.customizations ? `(${item.customizations})` : ""}</span>
              <span>${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="totals">
          <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
          {order.discount > 0 && <p>Discount: -${order.discount.toFixed(2)}</p>}
          <p className="total">Total: ${order.total.toFixed(2)}</p>
        </div>
      </section>

      {/* 2. Delivery & Payment */}
      <section className="card">
        <h2>Delivery & Payment Details</h2>
        <p><strong>Address:</strong> {order.address}</p>
        <p><strong>ETA:</strong> {order.eta}</p>
        <p><strong>Payment:</strong> {order.paymentMethod}</p>
      </section>

      {/* 3. Order Status */}
      <section className="card">
        <h2>Order Status</h2>
        <ul className="status-list">
          {order.statusUpdates.map((status, idx) => (
            <li 
              key={idx} 
              className={status.active ? "active" : ""}
            >
              {status.label}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default OrderSummary;
