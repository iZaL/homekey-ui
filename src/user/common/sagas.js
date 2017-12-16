import {call, fork, put, select, takeLatest, all} from 'redux-saga/effects';
import {ACTION_TYPES} from './actions';
import {ACTIONS as APP_ACTIONS} from './../../app/common/actions';
import {API} from './api';
import isEmpty from 'lodash/isEmpty';
import {getFileName} from '../../common/functions';
import {SELECTORS as AUTH_SELECTORS} from '../../auth/common/selectors';
import {NavigationActions} from 'react-navigation';
import Qs from 'qs';
import I18n, {isRTL} from './../../app/common/locale';

function* fetchPropertyMessages(action) {
  try {
    const state = yield select();
    const apiToken = AUTH_SELECTORS.getAuthToken(state);

    if (isEmpty(apiToken)) {
      yield put({type: ACTION_TYPES.PROPERTY_THREAD_FETCH_FAILURE});
      yield put(APP_ACTIONS.setNotification(I18n.t('login_required'), 'error'));
      return yield put(
        NavigationActions.navigate({
          routeName: 'Login',
        }),
      );
    }

    const params = Qs.stringify({
      api_token: apiToken,
    });

    const response = yield call(
      API.fetchPropertyMessages,
      action.params.property_id,
      params,
    );

    yield put({
      type: ACTION_TYPES.PROPERTY_THREAD_FETCH_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({type: ACTION_TYPES.PROPERTY_THREAD_FETCH_FAILURE, error});
  }
}

function* fetchThreads(action) {
  try {
    const state = yield select();
    const apiToken = AUTH_SELECTORS.getAuthToken(state);

    if (isEmpty(apiToken)) {
      yield put({type: ACTION_TYPES.THREAD_FETCH_FAILURE});
      yield put(APP_ACTIONS.setNotification(I18n.t('login_required'), 'error'));
      return yield put(
        NavigationActions.navigate({
          routeName: 'Login',
        }),
      );
    }

    const params = Qs.stringify({
      api_token: apiToken,
    });

    const response = yield call(API.fetchThreads, params);

    yield put({
      type: ACTION_TYPES.THREAD_FETCH_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({type: ACTION_TYPES.THREAD_FETCH_FAILURE, error});
  }
}

function* fetchThreadDetail(action) {
  try {
    const state = yield select();
    const apiToken = AUTH_SELECTORS.getAuthToken(state);

    if (isEmpty(apiToken)) {
      yield put({type: ACTION_TYPES.THREAD_DETAIL_FETCH_FAILURE});
      yield put(APP_ACTIONS.setNotification(I18n.t('login_required'), 'error'));
      return yield put(
        NavigationActions.navigate({
          routeName: 'Login',
        }),
      );
    }

    const params = Qs.stringify({
      api_token: apiToken,
    });

    let threadID = action.params.thread_id;

    const response = yield call(API.fetchThreadDetail, threadID, params);

    yield put({
      type: ACTION_TYPES.THREAD_DETAIL_FETCH_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({type: ACTION_TYPES.THREAD_DETAIL_FETCH_FAILURE, error});
  }
}

function* updateUser(action) {
  try {
    const state = yield select();
    const apiToken = AUTH_SELECTORS.getAuthToken(state);
    const urlParams = `api_token=${apiToken}`;
    const {name_en, name_ar, image, company, mobile} = action.params;
    const params = {
      name_ar,
      name_en,
      mobile,
      company,
    };
    const response = yield call(API.updateUser, params, urlParams);
    if (isEmpty(image)) {
      yield put({
        type: ACTION_TYPES.USER_UPDATE_SUCCESS,
        payload: response.data,
      });
    } else {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: getFileName(image),
        type: 'image/jpg',
      });

      const imageResponse = yield call(API.uploadImage, formData, urlParams);
      yield put({
        type: ACTION_TYPES.USER_UPDATE_SUCCESS,
        payload: imageResponse.data,
      });
    }
  } catch (error) {
    yield put({type: ACTION_TYPES.USER_UPDATE_FAILURE, error});
  }
}

export function* createThread(action) {
  try {
    const state = yield select();
    const apiToken = AUTH_SELECTORS.getAuthToken(state);

    if (isEmpty(apiToken)) {
      yield put({type: ACTION_TYPES.THREAD_CREATE_FAILURE});
      yield put(APP_ACTIONS.setNotification(I18n.t('login_required'), 'error'));
      return yield put(
        NavigationActions.navigate({
          routeName: 'Login',
        }),
      );
    }

    const urlParams = `api_token=${apiToken}`;
    const {message} = action.params;
    const response = yield call(API.addMessage, message, urlParams);
    yield put({
      type: ACTION_TYPES.THREAD_CREATE_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({type: ACTION_TYPES.THREAD_CREATE_FAILURE, error});
  }
}

export function* addMessage(action) {
  try {
    const state = yield select();
    const apiToken = AUTH_SELECTORS.getAuthToken(state);

    if (isEmpty(apiToken)) {
      yield put({type: ACTION_TYPES.MESSAGE_ADD_FAILURE});
      yield put(APP_ACTIONS.setNotification(I18n.t('login_required'), 'error'));
      return yield put(
        NavigationActions.navigate({
          routeName: 'Login',
        }),
      );
    }

    const urlParams = `api_token=${apiToken}`;
    const {message} = action.params;

    const params = {
      ...message,
    };
    console.log('params',params);

    const response = yield call(API.addMessage, params, urlParams);
    yield put({
      type: ACTION_TYPES.MESSAGE_ADD_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({type: ACTION_TYPES.MESSAGE_ADD_FAILURE, error});
  }
}

function* userUpdateMonitor() {
  yield takeLatest(ACTION_TYPES.USER_UPDATE_REQUEST, updateUser);
}

function* propertyMessagesFetchMonitor() {
  yield takeLatest(
    ACTION_TYPES.PROPERTY_THREAD_FETCH_REQUEST,
    fetchPropertyMessages,
  );
}

function* createThreadMonitor() {
  yield takeLatest(ACTION_TYPES.THREAD_CREATE_REQUEST, createThread);
}

function* threadsMonitor() {
  yield takeLatest(ACTION_TYPES.THREAD_FETCH_REQUEST, fetchThreads);
}

function* threadDetailMonitor() {
  yield takeLatest(ACTION_TYPES.THREAD_DETAIL_FETCH_REQUEST, fetchThreadDetail);
}

function* addMessageMonitor() {
  yield takeLatest(ACTION_TYPES.MESSAGE_ADD_REQUEST, addMessage);
}

const USER_SAGA = all([
  fork(userUpdateMonitor),
  fork(threadDetailMonitor),
  fork(propertyMessagesFetchMonitor),
  fork(createThreadMonitor),
  fork(threadsMonitor),
  fork(addMessageMonitor),
]);

export default USER_SAGA;
