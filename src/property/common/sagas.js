import Qs from 'qs';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';
import {ACTION_TYPES} from './actions';
import {API} from './api';
import {ACTIONS as APP_ACTIONS} from './../../app/common/actions';
import {ACTION_TYPES as USER_ACTION_TYPES} from './../../user/common/actions';
import {SELECTORS} from './selectors';
import {SELECTORS as APP_SELECTORS} from './../../app/common/selectors';
import {SELECTORS as AUTH_SELECTORS} from './../../auth/common/selectors';
import {getFileExtension, getFileName} from './../../common/functions';
import NavigationService from './../../components/NavigationService';

import find from 'lodash/find';
import {hasArabicChar, parseArabicChar} from '../../common/functions';
import I18n, {isRTL} from './../../app/common/locale';
import omit from 'lodash/omit';

function* fetchProperties() {
  try {
    const state = yield select();
    const country = APP_SELECTORS.getSelectedCountry(state).id;
    const apiToken = AUTH_SELECTORS.getAuthToken(state);
    const type = SELECTORS.getSelectedPropertyType(state).key;
    const filters = SELECTORS.getFilters(state);
    const sortOption = SELECTORS.getSelectedSortOption(state);

    let newFilters = omit(filters, 'searchString');

    let params = Qs.stringify({
      api_token: apiToken,
      sortBy: sortOption,
      country,
      type,
      ...newFilters,
    });

    params = `${params}&searchString=${filters.searchString}`;

    const {nextPageUrl} = state.propertyReducer;

    // check if there is next page
    if (nextPageUrl === null) {
      yield put({
        type: ACTION_TYPES.PROPERTY_FAILURE,
        error: I18n.t('no_more_records'),
      });
    } else {
      // initial query

      let urlParams = nextPageUrl ? nextPageUrl : `/?${params}`;

      const response = yield call(API.fetchProperties, urlParams);

      yield put({
        type: ACTION_TYPES.PROPERTY_SUCCESS,
        payload: response.data,
      });

      if (response.data.data && response.data.data.length === 0) {
        yield put({
          type: ACTION_TYPES.PROPERTY_RELATED_REQUEST,
        });
      }

      if (!nextPageUrl) {
        yield put({
          type: ACTION_TYPES.PROPERTY_ADD_ITEM_TO_HISTORY_REQUEST,
          payload: {
            type,
            country,
            filters,
            total: response.data.total,
          },
        });
      }
    }
  } catch (error) {
    yield put({type: ACTION_TYPES.PROPERTY_FAILURE, error});
  }
}

function* fetchRelatedProperties() {
  try {
    const state = yield select();
    const country = APP_SELECTORS.getSelectedCountry(state).id;
    const apiToken = AUTH_SELECTORS.getAuthToken(state);
    const type = SELECTORS.getSelectedPropertyType(state).key;

    const params = Qs.stringify({
      api_token: apiToken,
      country,
      type,
    });

    let urlParams = `/?${params}`;

    const response = yield call(API.fetchProperties, urlParams);
    yield put({
      type: ACTION_TYPES.PROPERTY_RELATED_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({type: ACTION_TYPES.PROPERTY_RELATED_FAILURE, error});
  }
}

function* fetchMyProperties(action) {
  try {
    const state = yield select();
    const apiToken = AUTH_SELECTORS.getAuthToken(state);
    const propertyReducer = state.authReducer.token;

    const params = Qs.stringify({
      api_token: apiToken,
      all: true,
    });
    const {myNextPageUrl} = propertyReducer;
    let urlParams;

    // check if there is next page
    if (myNextPageUrl === null) {
      yield put({
        type: ACTION_TYPES.MY_PROPERTY_FAILURE,
        error: I18n.t('no_more_records'),
      });
    } else {
      // initial query
      if (myNextPageUrl === undefined) {
        urlParams =
          isEmpty(action.params) || action.params === undefined
            ? `/?${params}`
            : `/?${action.params}&${params}`;
      } else {
        urlParams = myNextPageUrl;
      }

      const response = yield call(API.fetchMyProperties, urlParams);
      yield put({
        type: ACTION_TYPES.MY_PROPERTY_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({type: ACTION_TYPES.MY_PROPERTY_FAILURE, error});
  }
}

function* fetchUserProperties(action) {
  try {
    const state = yield select();
    const apiToken = AUTH_SELECTORS.getAuthToken(state);
    const {propertiesNextPageUrl} = state.userReducer;

    const params = Qs.stringify({
      api_token: apiToken,
    });

    let userID = action.params.userID;

    // check if there is next page
    if (propertiesNextPageUrl === null) {
      yield put({
        type: USER_ACTION_TYPES.USER_PROPERTIES_FAILURE,
        error: I18n.t('no_more_records'),
      });
    } else {
      let urlParams = propertiesNextPageUrl
        ? propertiesNextPageUrl
        : `/?${params}`;

      const response = yield call(API.fetchUserProperties, userID, urlParams);
      yield put({
        type: USER_ACTION_TYPES.USER_PROPERTIES_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({type: USER_ACTION_TYPES.USER_PROPERTIES_FAILURE, error});
  }
}

function* addItemToHistory(action) {
  let id = Math.floor((1 + Math.random()) * 0x1000000000).toString(16);

  const state = yield select();
  const historyReducer = state.propertyHistoryReducer;

  const {type, filters, country, total} = action.payload;

  // search history
  let newFilters = {
    [type]: {
      ...filters,
      country,
    },
  };

  let found = find(historyReducer, newFilters);

  if (found) {
    yield put({
      type: ACTION_TYPES.PROPERTY_REMOVE_ITEM_FROM_HISTORY,
      payload: found,
    });
  }

  let payload = {
    [type]: {
      id,
      ...filters,
      country,
      total,
    },
  };

  yield put({
    type: ACTION_TYPES.PROPERTY_ADD_ITEM_TO_HISTORY,
    payload: payload,
  });
}

function* fetchFavorites(action) {
  try {
    const state = yield select();
    const apiToken = AUTH_SELECTORS.getAuthToken(state);
    const {nextPageFavoritesUrl} = state.propertyReducer;
    let urlParams;
    // set if there is no next page
    if (nextPageFavoritesUrl === null) {
      return yield put({
        type: ACTION_TYPES.FAVORITES_FAILURE,
        error: I18n.t('no_more_records'),
      });
    }

    const params = Qs.stringify({api_token: apiToken});

    if (nextPageFavoritesUrl === undefined) {
      urlParams = isEmpty(action.params)
        ? `/?${params}`
        : `/?${action.params}&${params}`;
    } else {
      urlParams = nextPageFavoritesUrl;
    }
    const response = yield call(API.fetchFavorites, urlParams);
    yield put({type: ACTION_TYPES.FAVORITES_SUCCESS, payload: response.data});
  } catch (error) {
    yield put({type: ACTION_TYPES.FAVORITES_FAILURE, error});
  }
}

function* favoriteProperty(action) {
  try {
    const state = yield select();
    const apiToken = AUTH_SELECTORS.getAuthToken(state);

    if (isEmpty(apiToken)) {
      yield put({
        type: ACTION_TYPES.PROPERTY_FAVORITE_FAILURE,
        error: 'not logged in',
      });
      yield put(APP_ACTIONS.setNotification(I18n.t('login_required'), 'error'));
      yield NavigationService.navigate('Login');
    }

    yield put({
      type: ACTION_TYPES.PROPERTY_FAVORITE_OPTIMISTIC_UPDATE,
      payload: action,
    });
    const urlParams = `?api_token=${apiToken}`;
    const response = yield call(API.favoriteProperty, urlParams, action.params);
    yield put({
      type: ACTION_TYPES.PROPERTY_FAVORITE_SUCCESS,
      payload: response,
    });
  } catch (error) {
    yield put({type: ACTION_TYPES.PROPERTY_FAVORITE_FAILURE, error});
  }
}

function* updateAddress(action) {
  console.log('action', action);

  const {address, resolve, reject} = action.payload;

  try {
    const response = yield call(API.updateAddress, address);
    yield resolve(response.data);
    yield put({type: ACTION_TYPES.UPDATE_ADDRESS_SUCCESS, response: response});
  } catch (error) {
    yield put({type: ACTION_TYPES.UPDATE_ADDRESS_FAILURE, error});
    // yield put(
    //   APP_ACTIONS.setNotification({
    //     message: I18n.t('address_save_failure'),
    //     type: 'error',
    //   }),
    // );
    yield reject(error);
  }
}

function* deleteProperty(action) {
  try {
    const state = yield select();
    const apiToken = AUTH_SELECTORS.getAuthToken(state);

    if (isEmpty(apiToken)) {
      yield put(APP_ACTIONS.setNotification(I18n.t('login_required'), 'error'));
      return yield NavigationService.navigate('Login');
    }
    const urlParams = `?api_token=${apiToken}`;
    const response = yield call(API.deleteProperty, urlParams, action.params);

    yield put({
      type: ACTION_TYPES.PROPERTY_DELETE_SUCCESS,
      payload: response,
    });
    yield put(APP_ACTIONS.setNotification(I18n.t('deleted'), 'success'));
  } catch (error) {
    yield put({type: ACTION_TYPES.PROPERTY_DELETE_FAILURE, error});
  }
}

function* saveProperty(action) {
  try {
    const state = yield select();
    const country = APP_SELECTORS.getSelectedCountry(state).id;
    const apiToken = AUTH_SELECTORS.getAuthToken(state);

    if (isEmpty(apiToken)) {
      yield put({type: ACTION_TYPES.PROPERTY_SAVE_FAILURE});
      yield put(APP_ACTIONS.setNotification(I18n.t('login_required'), 'error'));
      return yield NavigationService.navigate('Login');
    }

    let attributes = action.payload;
    let propertyID = attributes._id ? attributes._id : null;

    const {price, mobile, phone, area} = attributes.meta;

    const filteredPrice = hasArabicChar(price) ? parseArabicChar(price) : price;
    const filteredPhone1 = hasArabicChar(mobile)
      ? parseArabicChar(mobile)
      : mobile;
    const filteredPhone2 = hasArabicChar(phone)
      ? parseArabicChar(phone)
      : phone;
    const filteredArea = hasArabicChar(area) ? parseArabicChar(area) : area;

    const {
      type,
      category,
      description,
      address,
      meta,
      images,
      amenities,
      nearByPlaces,
      tags,
      video,
    } = attributes;

    let title;

    title = `${I18n.t(category)} ${I18n.t(type)} ${I18n.t('in')} ${
      isRTL ? address.city_ar : address.city_en
    }`;

    const params = {
      _id: propertyID,
      country,
      type,
      category,
      title,
      description,
      address,
      meta: {
        ...meta,
        price: filteredPrice,
        mobile: filteredPhone1,
        phone: filteredPhone2,
        area: filteredArea,
      },
      images,
      amenities,
      nearByPlaces,
      tags,
      video,
    };

    const urlParams = `api_token=${apiToken}`;
    const response = yield call(API.saveProperty, params, urlParams);

    const formData = new FormData();

    map(images, img => {
      formData.append('images[]', {
        uri: img,
        name: getFileName(img),
        type: getFileExtension(img),
      });
    });
    // if(params.video) {
    //   formData.append("video", params.video);
    // }
    const imageResponse = yield call(
      API.uploadImage,
      response.data._id,
      formData,
    );

    yield put({
      type: ACTION_TYPES.PROPERTY_SAVE_SUCCESS,
      payload: imageResponse,
    });

    yield put(APP_ACTIONS.setNotification(I18n.t('saved'), 'success'));
  } catch (error) {
    yield put({type: ACTION_TYPES.PROPERTY_SAVE_FAILURE, error});
    yield put(APP_ACTIONS.setNotification(error, 'error'));
  }
}

function* setFilters() {
  yield put({type: ACTION_TYPES.PROPERTY_RESET});
}

function* incrementViews(action) {
  let propertyID = action.propertyID;
  yield call(API.incrementViews, propertyID);
}

// Monitoring Sagas
function* propertyMonitor() {
  yield takeLatest(ACTION_TYPES.PROPERTY_REQUEST, fetchProperties);
}

function* propertyRelatedMonitor() {
  yield takeLatest(
    ACTION_TYPES.PROPERTY_RELATED_REQUEST,
    fetchRelatedProperties,
  );
}

function* myPropertyMonitor() {
  yield takeLatest(ACTION_TYPES.MY_PROPERTY_REQUEST, fetchMyProperties);
}

function* userPropertyMonitor() {
  yield takeLatest(
    USER_ACTION_TYPES.USER_PROPERTIES_REQUEST,
    fetchUserProperties,
  );
}

function* favoriteMonitor() {
  yield takeLatest(ACTION_TYPES.FAVORITES_REQUEST, fetchFavorites);
}

function* propertyFavoriteMonitor() {
  yield takeLatest(ACTION_TYPES.PROPERTY_FAVORITE_REQUEST, favoriteProperty);
}

function* propertyDeleteMonitor() {
  yield takeLatest(ACTION_TYPES.PROPERTY_DELETE_REQUEST, deleteProperty);
}

function* propertySaveMonitor() {
  yield takeLatest(ACTION_TYPES.PROPERTY_SAVE_REQUEST, saveProperty);
}

function* propertyFiltersSetMonitor() {
  yield takeLatest(ACTION_TYPES.PROPERTY_SET_FILTERS_REQUEST, setFilters);
}

function* propertyIncrementViewCount() {
  yield takeLatest(ACTION_TYPES.PROPERTY_INCREMENT_VIEW_COUNT, incrementViews);
}

function* propertyHistoryMonitor() {
  yield takeLatest(
    ACTION_TYPES.PROPERTY_ADD_ITEM_TO_HISTORY_REQUEST,
    addItemToHistory,
  );
}

function* updateAddressMonitor() {
  yield takeLatest(ACTION_TYPES.UPDATE_ADDRESS_REQUEST, updateAddress);
}

const PROPERTY_SAGA = all([
  fork(propertyMonitor),
  fork(propertyRelatedMonitor),
  fork(myPropertyMonitor),
  fork(userPropertyMonitor),
  fork(favoriteMonitor),
  fork(propertyFavoriteMonitor),
  fork(propertySaveMonitor),
  fork(propertyFiltersSetMonitor),
  fork(propertyIncrementViewCount),
  fork(propertyDeleteMonitor),
  fork(propertyHistoryMonitor),
  fork(updateAddressMonitor),
]);

export default PROPERTY_SAGA;
