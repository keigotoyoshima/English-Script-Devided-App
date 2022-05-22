import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser
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

    if (response.status == 204){
      createUserWithEmailAndPassword(auth, email, password)
        .then(async () => {
          // django-dbにユーザー情報登録を先に行う
          let res =  await postUserTask({ displayName: name, email: email, password: password })
          // console.log(res, 'res');
          // django側で登録がうまくいかなかった時，firebaseの登録取り消す．
          if (res == "Fail post user"){
            deleteUser(auth.currentUser).then(() => {
              console.log("success firebase register but fail backend register");
            }).catch((error) => {
              console.log(error, 'error');
            });
          }else{
            updateProfile(auth.currentUser, {
              displayName: name,
            })
            // app.js用
            setDisplayName(name)
          }
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
    // dev開発用
    // setDisplayName("docker");
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        let response = await getUserTask(res.user.displayName);
        // console.log(response.status, 'response.status');
        if (response.status != 204) {
          // 既に登録積みの場合
          setDisplayName(res.user.displayName)
        }else{
          // firebase上に存在するが，db上に存在しない場合(dev用)
          setError('Not found user infomation!')
        }
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