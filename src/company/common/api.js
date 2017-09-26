import {API_URL} from '../../env';
import {fetchAPI} from '../../common/api';

function fetchDomesticCompanies(params) {
  const url = `${API_URL}/companies/domestic${params}`;
  return fetchAPI(url);
}

export const API = {
  fetchDomesticCompanies,
};
