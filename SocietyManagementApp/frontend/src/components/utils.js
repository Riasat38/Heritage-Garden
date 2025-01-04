'use strict';

export const getUserFromStorage = () => {
    try {
        // Retrieve the 'user' object from localStorage
        const user = localStorage.getItem('user');

        // If 'user' is not found, return null
        if (!user) {
            console.warn('No user found in localStorage.');
            return null;
        }

        // Parse the JSON string into an object
        const parsedUser = JSON.parse(user);

        // Check if the parsed object has a 'token' property
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.token) {
            return parsedUser.token; // Return the token
        }

        // If no token exists in the object, log a warning and return null
        console.warn('User object does not contain a token:', parsedUser);
        return null;
    } catch (error) {
        console.error('Failed to fetch or parse user from localStorage:', error);
        return null; // Return null in case of errors
    }
};

