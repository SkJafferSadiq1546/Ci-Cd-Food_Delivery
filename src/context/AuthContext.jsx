import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the context which will be shared
const AuthContext = createContext(null);

// 2. Create a custom hook to make it easy to use the context in other components
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. Create the AuthProvider component that will wrap your entire app
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    // This effect runs only once when the application first loads
    useEffect(() => {
        // Check the browser's localStorage to see if a user was already logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // If a user is found, set them as the current user
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    // Function to handle logging in a user
    const login = (userData) => {
        // Save the user data to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        // Set the user data in the component's state
        setCurrentUser(userData);
    };

    // Function to handle logging out a user
    const logout = () => {
        // Remove the user data from localStorage
        localStorage.removeItem('user');
        // Set the current user in the state to null
        setCurrentUser(null);
    };

    // The value that will be provided to all child components
    const value = {
        currentUser,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};