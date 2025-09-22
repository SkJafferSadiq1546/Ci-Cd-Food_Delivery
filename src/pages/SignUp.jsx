import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState(''); 
    const [phoneNumber, setPhoneNumber] = useState(''); 
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // ✅ Send the address along with other user details
            await axios.post('http://localhost:8080/api/auth/register', {
                name,
                email,
                password,
                address,
                phoneNumber
            });
            alert('Registration successful! Please sign in.');
            navigate('/signin');
        } catch (err) {
            setError(err.response?.data || "Registration failed.");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleRegister}>
                <h2>Sign Up</h2>
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="auth-button">Register</button>
                <p className="auth-switch">
                    Already have an account? <Link to="/signin">Sign In</Link>
                </p>
            </form>
        </div>
    );
};

export default SignUp;