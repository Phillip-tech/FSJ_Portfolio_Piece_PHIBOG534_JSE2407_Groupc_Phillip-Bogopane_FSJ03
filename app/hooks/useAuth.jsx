import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, updateProfile } from 'firebase/auth';
import { app } from '../lib/firebase.js'

const auth = getAuth(app);

/**
 * A custom React hook for managing user authentication state with Firebase.
 *
 * This hook provides the current authenticated user and functions to sign in,
 * sign up, and sign out users using Firebase Authentication. It listens for
 * authentication state changes and updates the user state accordingly.
 *
 * @returns {Object} An object containing:
 * - {Object|null} user: The current authenticated user, or null if not authenticated.
 * - {Function} signIn: A function to sign in a user with email and password.
 * - {Function} signUp: A function to create a new user account with email, password, and display name.
 * - {Function} signOut: A function to sign out the current user.
 */
const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    };

/**
 * Creates a new user account with the provided email, password, and display name.
 *
 * This function uses Firebase Authentication to register a new user. After
 * successfully creating the user, it updates the user profile with the given
 * display name and sets the current user state.
 *
 * @param {string} email - The email address of the new user.
 * @param {string} password - The password for the new user's account.
 * @param {string} displayName - The display name for the new user.
 * @throws Will throw an error if the sign-up process fails.
 */
    const signUp = async (email, password, displayName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName });
            setUser(userCredential.user);
        } catch (error) {
            console.error('Error signing up:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try { 
            await firebaseSignOut(auth); // Used the renamed function here
            console.log('User signed out'); 
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return { user, signIn, signUp, signOut };
};

export default useAuth;
