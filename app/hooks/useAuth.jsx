import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, updateProfile } from 'firebase/auth';
import { app } from '../lib/firebase'

const auth = getAuth(app);

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
        await signOut(auth);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };
  
    return { user, signIn, signUp, signOut };
  };
  
  export default useAuth;