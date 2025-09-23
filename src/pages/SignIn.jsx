import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import './SignIn.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await apiClient.post('/auth/login', {
                email,
                password
            });
            
            login(response.data);
            navigate('/home');

        } catch (err) {
            console.error("Login failed:", err);
            if (err.response && err.response.status === 401) {
                setError("Invalid email or password. Please try again.");
            } else {
                setError("An error occurred during login. Please try again later.");
            }
        }
    };

    return (
        <div className="auth-container"> {/* This centers the entire form */}
            <form className="auth-form" onSubmit={handleLogin}>
                <h2>Sign In</h2>
                <div className="form-group"> {/* This now contains label and input side-by-side */}
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" // Add ID for better accessibility
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group"> {/* This now contains label and input side-by-side */}
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" // Add ID for better accessibility
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="auth-button">Sign In</button>
                <p className="auth-switch">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default SignIn;