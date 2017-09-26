/**
 * @flow
 */
export const ACTION_TYPES = {
  DOMESTIC_COMPANIES_REQUEST: 'DOMESTIC_COMPANIES_REQUEST',
  DOMESTIC_COMPANIES_SUCCESS: 'DOMESTIC_COMPANIES_SUCCESS',
  DOMESTIC_COMPANIES_FAILURE: 'DOMESTIC_COMPANIES_FAILURE',
  DOMESTIC_COMPANIES_RESET_NEXT_PAGE_URL:
    'DOMESTIC_COMPANIES_RESET_NEXT_PAGE_URL',
  DOMESTIC_COMPANIES_RESET: 'DOMESTIC_COMPANIES_RESET',
};

function fetchDomesticCompanies(params) {
  return {
    type: ACTION_TYPES.DOMESTIC_COMPANIES_REQUEST,
    params,
  };
}

function resetDomesticCompanies() {
  return {
    type: ACTION_TYPES.DOMESTIC_COMPANIES_RESET,
  };
}
function resetDomesticCompaniesNextPageURL() {
  return {
    type: ACTION_TYPES.DOMESTIC_COMPANIES_RESET_NEXT_PAGE_URL,
  };
}
export const ACTIONS = {
  fetchDomesticCompanies,
  resetDomesticCompanies,
  resetDomesticCompaniesNextPageURL,
};
