import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import all your page components
import Splash from "./pages/Splash";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import FoodDetails from "./pages/FoodDetails";
import PaymentPage from "./pages/PaymentPage";
import OrderConfirmationPage from "./pages/OrderConfirmation"; // ✅ 1. ADDED this import
import MyOrders from "./pages/MyOrders";
import OrderTracking from "./pages/OrderTracking";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/food/:id" element={<FoodDetails />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/tracking/:orderId" element={<OrderTracking />} />
            
            {/* ✅ 2. ADDED the missing route for the confirmation page */}
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;