import axios from 'axios';


const API_BASE_URL = 'http://127.0.0.1:8000/'; 

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

export function getAllWordsTask() {
  return client.get('/api/youtube-word-get');
}

export function getSingleWordTask(id) {
  console.log('params in createTask')
  return client.get(`/api/youtube-word-get?id=${id}`);
}

export function getWordKeyTask(id) {
  console.log('params in createTask')
  return client.get(`/api/youtube-word-key-get?id=${id}`);
}


export function createTask(params) {
  console.log(params, 'params in createTask')
  return client.post('/api/youtube-word-post', params);
}

export function editTask(id, params) {
  return client.put(`/api/${id}`, params);
}

export function deleteTask(id) {
  return client.delete(`/api/${id}/`);
}