import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import React from "react";
import { auth } from "../../firebase";
// import { postUserTask } from "../frontend_api/DjangoApi";
import { getUserTask, postUserTask } from "../frontend_api/DjangoApi";
import { async } from "@firebase/util";




export const UserContext = createContext({});

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [index, setIndex] = useState("");

  useState(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (res) => {
      if (res) {
        setUser(res);
      } else {
        setUser(null);
      }
      setError("");
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setError("")
  }, [index]);



  // displayNameを重複不可にする必要あり
  const registerUser = async (email, password, name) => {
    setLoading(true);
    // nameが一意に定まるか判定
    let response = await getUserTask(name);
    if (response.data != "Success find User in user_api_view"){
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          // django-dbにユーザー情報登録を先に行う
          postUserTask({ displayName: name, email: email })
          updateProfile(auth.currentUser, {
            displayName: name,
          })
          // app.js用
          setDisplayName(name)
        }
        )
        .catch((err) => {
          switch (err.code) {
            case 'auth/email-already-in-use':
              setError('Email already in use !')
          }
        })
        .finally(() => setLoading(false));
    }else{
      setError('Name is already used !')
      setLoading(false);
    }
    
  };

  const signInUser = (email, password) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        setDisplayName(res.user.displayName)
      })
      .catch((err) => {
        switch (err.code) {
          case 'auth/user-not-found':
            setError('Wrong email address !')
            break;
          case 'auth/wrong-password':
            setError('Wrong password !')
            break;
        }
      })
      .finally(() => setLoading(false));
  };

  const logoutUser = () => {
    signOut(auth);
    setDisplayName(null)
  };

  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const contextValue = {
    user,
    displayName,
    loading,
    error,
    signInUser,
    registerUser,
    logoutUser,
    forgotPassword,
    index,
    setIndex,
  };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};