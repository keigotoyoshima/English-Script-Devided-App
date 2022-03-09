import axios from 'axios';


const API_BASE_URL = 'http://127.0.0.1:8000/'; 

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});


export function postUserTask(params) {
  console.log(params, 'params in postMovieTask')
  return client.post('/api/user-post', params);
}

export function getAllMoviesTask() {
  return client.get('/api/movie-get');
}

export function getSingleMovieTask(id) {
  console.log('params in createTask')
  return client.get(`/api/movie-get?id=${id}`);
}


export function postMovieTask(params) {
  console.log(params, 'params in postMovieTask')
  return client.post('/api/movie-post', params);
}

export function getAllWordsTask() {
  return client.get('/api/word-get');
}
// 使ってない
export function getSingleWordTask(id) {
  console.log('params in createTask')
  return client.get(`/api/word-get?id=${id}`);
}


export function postWordTask(params) {
  console.log(params, 'params in postWordTask')
  return client.post('/api/word-post', params);
}

export function editTask(id, params) {
  return client.put(`/api/${id}`, params);
}

export function deleteTask(id) {
  return client.delete(`/api/${id}/`);
}