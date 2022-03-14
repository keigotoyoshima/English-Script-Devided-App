import axios from 'axios';
import { useUserContext } from '../userContext/userContext';
import { createContext,useContext } from 'react';
import React from 'react';

const IP_AND_PORT = process.env.REACT_APP_DJANGO_DATA_API_IP_PORT; 

const client = axios.create({
  baseURL: IP_AND_PORT,
  headers: {
    'Content-Type': 'application/json'
  },
});

// register用にpostUserTaskだけProviderから除外
export const postUserTask = (params) => {
  return client.post('/api/user-post', params);
}

export const DjangoApiContext = createContext({});

export const useDjangoApiContext = () => {
  return useContext(DjangoApiContext);
};

export const DjangoApiContextProvider = ({ children }) => {
  const {user} = useUserContext();




  const getAllMoviesTask = () => {
    return client.get(`/api/movie-get?displayName=${user.displayName}`);
  }


  const postMovieTask = (params) => {
    console.log("postMovieTask!!")
    return client.post('/api/movie-post', params);
  }

  const getAllWordsTask = (v) => {
    return client.get(`/api/word-get?displayName=${user.displayName}&v=${v}`);
  }



  const postWordTask = (params) => {
    return client.post('/api/word-post', params);
  }

  const editTask = (id, params) => {
    return client.put(`/api/${id}`, params);
  }

  const deleteTask = (id) => {
    return client.delete(`/api/${id}/`);
  }

  const contextValue = {
    getAllMoviesTask,
    postMovieTask,
    getAllWordsTask,
    postWordTask,
  };
  return (
    <DjangoApiContext.Provider value={contextValue}>
      {children}
    </DjangoApiContext.Provider>
  );
}