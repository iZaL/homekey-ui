import Qs from 'qs';
import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';
import {ACTION_TYPES} from './actions';
import {API} from './api';
import {SELECTORS as APP_SELECTORS} from './../../app/common/selectors';
import {SELECTORS as AUTH_SELECTORS} from './../../auth/common/selectors';
import I18n from './../../app/common/locale';

function* fetchCompanies() {
  try {
    const state = yield select();
    const country = APP_SELECTORS.getSelectedCountry(state).id;
    const apiToken = AUTH_SELECTORS.getAuthToken(state);

    let params = Qs.stringify({
      api_token: apiToken,
      country,
    });

    const {domesticNextPageUrl} = state.companyReducer;

    // check if there is next page
    if (domesticNextPageUrl === null) {
      yield put({
        type: ACTION_TYPES.DOMESTIC_COMPANIES_FAILURE,
        error: I18n.t('no_more_records'),
      });
    } else {
      // initial query

      let urlParams = domesticNextPageUrl ? domesticNextPageUrl : `/?${params}`;

      const response = yield call(API.fetchDomesticCompanies, urlParams);

      yield put({
        type: ACTION_TYPES.DOMESTIC_COMPANIES_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({type: ACTION_TYPES.DOMESTIC_COMPANIES_FAILURE, error});
  }
}

// Monitoring Sagas
function* companyMonitor() {
  yield takeLatest(ACTION_TYPES.DOMESTIC_COMPANIES_REQUEST, fetchCompanies);
}

const COMPANY_SAGA = all([fork(companyMonitor)]);

export default COMPANY_SAGA;
