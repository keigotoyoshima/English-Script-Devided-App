import axios from 'axios';
import { useUserContext } from '../userContext/userContext';
import { createContext,useContext } from 'react';
import React from 'react';

// export const IP_AND_PORT = process.env.REACT_APP_DJANGO_DATA_API_IP_PORT; 
export const IP_AND_PORT = process.env.REACT_APP_DJANGO_DATA_API_IP_PORT_LOCAL; 

const client = axios.create({
  baseURL: IP_AND_PORT,
  headers: {
    'Content-Type': 'application/json'
  },
});

// register用にpostUserTaskとgetUserTaskだけProviderから除外
export const postUserTask = (params) => {
  let response = client.post(`/api/user-post/`, params);
  // console.log(response , 'response in postUserTask');
  return response
}

export const getUserTask = (name) => {
  let response = client.get(`/api/user-get/${name}/`);
  // console.log(response, 'response in getUserTask');
  return response
}

export const DjangoApiContext = createContext({});

export const useDjangoApiContext = () => {
  return useContext(DjangoApiContext);
};

export const DjangoApiContextProvider = ({ children }) => {
  const {user, displayName} = useUserContext();



  const getAllMoviesTask = () => {
    let response = client.get(`/api/movie-get/${displayName}/`);
    // console.log(response, 'response in getAllMoviesTask');
    return response;
  }


  const postMovieTask = (params) => {
    let response = client.post(`/api/movie-post/${displayName}/`, params);
    // console.log(response, 'response in postMovieTask');
    return response;
  }

  const putMovieTask = (params) => {
    let response = client.put(`/api/movie-put/${displayName}/`, params);
    // console.log(response, 'response in putMovieTask');
    return response;
  }

  const deleteMovieTask = (v) => {
    let response = client.delete(`/api/movie-delete/${displayName}/${v}/`);
    console.log(response, 'response in deleteMovieTask');
    return response;
  }

  const getAllWordsTask = (v) => {
    let response =  client.get(`/api/word-get/${displayName}/${v}/`);
    // console.log(response, 'response in getAllWordsTask');
    return response;
  }

  const postWordTask = (v, params) => {
    let response = client.post(`/api/word-post/${displayName}/${v}/`, params);
    // console.log(response, 'response in postWordTask');
    return response;
  }

  const editTask = (id, params) => {
    return client.put(`/api/${id}/`, params);
  }

  const deleteTask = (id) => {
    return client.delete(`/api/${id}/`);
  }

  const contextValue = {
    getAllMoviesTask,
    postMovieTask,
    putMovieTask,
    deleteMovieTask,
    getAllWordsTask,
    postWordTask,
  };
  return (
    <DjangoApiContext.Provider value={contextValue}>
      {children}
    </DjangoApiContext.Provider>
  );
}