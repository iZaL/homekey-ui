import {API_URL} from '../../env';
import {fetchAPI} from '../../common/api';

function storePushToken(urlParams, body) {
  const url = `${API_URL}/pushtoken/register${urlParams}`;
  return fetchAPI(url, 'POST', body);
}

function uploadImages(params) {
  const url = `${API_URL}/uploads/images`;
  return fetchAPI(url, 'POST',params.body,true);
}

function saveUploads(params) {
  const path = `${API_URL}/uploads/sync`;
  return fetchAPI({path, method: 'POST', params});
}

export const API = {
  storePushToken,
  uploadImages,
  saveUploads,
};
