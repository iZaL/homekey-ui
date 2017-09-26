import {API_URL} from '../../env.js';
import {fetchAPI} from '../../common/api';

function fetchUser(id, params) {
  const url = `${API_URL}/users/${id}/${params}`;
  return fetchAPI(url);
}

function updateUser(body, urlParams) {
  const url = `${API_URL}/users/edit?${urlParams}`;
  return fetchAPI(url, 'POST', body);
}

function uploadImage(body, urlParams) {
  const url = `${API_URL}/users/image/upload?${urlParams}`;
  return fetchAPI(url, 'POST', body, true);
}

function fetchPropertyMessages(id, params) {
  const url = `${API_URL}/properties/${id}/threads?${params}`;
  return fetchAPI(url);
}

function fetchThreads(params) {
  const url = `${API_URL}/threads?${params}`;
  return fetchAPI(url);
}

function fetchThreadDetail(threadID, params) {
  const url = `${API_URL}/threads/${threadID}/show?${params}`;
  return fetchAPI(url);
}

function addMessage(body, urlParams) {
  const url = `${API_URL}/properties/messages/add?${urlParams}`;
  return fetchAPI(url, 'POST', body);
}

export const API = {
  fetchUser,
  updateUser,
  uploadImage,
  fetchPropertyMessages,
  fetchThreads,
  fetchThreadDetail,
  addMessage,
};
