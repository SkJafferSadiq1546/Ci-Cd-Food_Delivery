import React from 'react';
import { useAuth } from '../context/AuthContext'; // ✅ 1. Import the useAuth hook
import { useNavigate, Link } from 'react-router-dom';
import "./Profile.css";

const Profile = () => {
    const { currentUser } = useAuth(); // ✅ 2. Get the user from the central context
    const navigate = useNavigate();

    // If no user is logged in, show a helpful message
    if (!currentUser) {
        return (
            <div className="profile-container">
                <div className="profile-card">
                    <p className="no-user">No user data found. Please <Link to="/signin">sign in</Link>.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>👤 Profile Details</h2>
                <p><strong>Name:</strong> {currentUser.name}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                {/* ✅ 3. Use the correct variable name: currentUser.phoneNumber */}
                <p><strong>Phone:</strong> {currentUser.phoneNumber || 'Not Provided'}</p>
                <p><strong>Address:</strong> {currentUser.address}</p>

                <button className="back-btn" onClick={() => navigate("/home")}>
                    ⬅ Back to Home
                </button>
            </div>
        </div>
    );
};

export default Profile;