import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          // You can add more user properties here from Firestore if needed
        });
      } else {
        // User is signed out
        setUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signup = useCallback(async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const logout = useCallback(async () => {
    return signOut(auth);
  }, []);

  const updateUserProfile = useCallback(async (profile) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently signed in.");
    }
    await updateProfile(currentUser, profile);
    // Update the user state with the new display name
    setUser((prevUser) => ({ ...prevUser, ...profile }));
  }, []);

  const deleteUserAccount = useCallback(async (password) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently signed in.");
    }

    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);
    await deleteUser(currentUser);
    await logout();
  }, []);

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateUserProfile,
    deleteUserAccount,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);