import isNull from 'lodash/isNull';
import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';
import {getItem as getStorageItem, setItem} from '../../common/storage';
import {API as AUTH_API, AUTH_STORAGE_KEY} from '../../auth/common/api';
import {ACTION_TYPES as AUTH_ACTION_TYPES} from '../../auth/common/actions';
import {ACTION_TYPES as PROPERTY_ACTION_TYPES} from '../../property/common/actions';
import {ACTION_TYPES} from './actions';
import {
  BOOTSTRAPPED_STORAGE_KEY,
  COUNTRY_KEY,
  LANGUAGE_STORAGE_KEY,
  PUSH_TOKEN_KEY,
} from './reducer';
import CodePush from 'react-native-code-push';

import {I18nManager} from 'react-native';
import {SELECTORS as AUTH_SELECTORS} from './../../auth/common/selectors';
import {API} from './api';
import 'moment/locale/ar-kw';
import 'moment/locale/en-au';
import moment from 'moment';
import NavigationService from '../../components/NavigationService';
import {getFileExtension, getFileName} from "../../common/functions";

function* bootstrapped(action) {
  if (action.value === true) {
    yield call(setItem, BOOTSTRAPPED_STORAGE_KEY, 'bootstrapped');
  }
}

function* boot() {
  const state = yield select();

  // 1- Set is the app has bootstrapped(run) before
  let bootstrappedStorageKey = yield call(
    getStorageItem,
    BOOTSTRAPPED_STORAGE_KEY,
  );
  if (!isNull(bootstrappedStorageKey)) {
    yield put({type: ACTION_TYPES.BOOTSTRAPPED, value: true});
  }

  // 2- Set language from history
  let currentLanguage = yield call(getStorageItem, LANGUAGE_STORAGE_KEY);
  if (isNull(currentLanguage)) {
    currentLanguage = state.appReducer.language;
  }
  currentLanguage === 'ar' ? moment.locale('ar-kw') : moment.locale('en-au');

  yield put({
    type: ACTION_TYPES.SET_LANGUAGE_SUCCESS,
    language: currentLanguage,
  });

  //3- Login from history and sync push token to user if exists
  const authStorageKey = yield call(getStorageItem, AUTH_STORAGE_KEY);
  const pushTokenStorageKey = yield call(getStorageItem, PUSH_TOKEN_KEY);

  if (!isNull(authStorageKey)) {
    try {
      let response = yield call(
        AUTH_API.login,
        {pushtoken: pushTokenStorageKey},
        authStorageKey,
      );
      yield put({
        type: AUTH_ACTION_TYPES.LOGIN_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      yield put({type: AUTH_ACTION_TYPES.LOGIN_FAILURE, error});
    }
  }

  //4- Set User Country
  let currentCountry = yield call(getStorageItem, COUNTRY_KEY);
  if (isNull(currentCountry)) {
    currentCountry = state.appReducer.selectedCountry;
  }
  yield put({type: ACTION_TYPES.COUNTRY_CHANGED, country: currentCountry});

  // 5- boot the app
  yield put({type: ACTION_TYPES.BOOT_SUCCESS});
}

function* changeCountrySaga(action) {
  let state = yield select();
  let currentCountry = state.appReducer.selectedCountry;

  if (currentCountry === action.country) return;

  yield call(setItem, COUNTRY_KEY, action.country);
  yield put({type: ACTION_TYPES.COUNTRY_CHANGED, country: action.country});
  yield put({type: PROPERTY_ACTION_TYPES.PROPERTY_RESET});
  yield put({type: PROPERTY_ACTION_TYPES.PROPERTY_REQUEST});
}

function* setLanguage(action) {
  // console.log('setting lang');
  if (action.language === 'en') {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  } else {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }

  yield call(setItem, LANGUAGE_STORAGE_KEY, action.language);

  yield put({
    type: ACTION_TYPES.SET_LANGUAGE_SUCCESS,
    language: action.language,
  });

  CodePush.restartApp();
}

function* setPushToken(action) {
  try {
    const state = yield select();
    const apiToken = AUTH_SELECTORS.getAuthToken(state);
    const pushTokenStorageKey = yield call(getStorageItem, PUSH_TOKEN_KEY);
    const urlParams = `?api_token=${apiToken}`;

    if (!pushTokenStorageKey) {
      yield call(setItem, PUSH_TOKEN_KEY, action.params.token);
      yield call(API.storePushToken, urlParams, {
        token: action.params.token,
        os: action.params.os,
      });
    }

    yield put({
      type: ACTION_TYPES.SET_PUSH_TOKEN_SUCCESS,
      token: action.params.token,
    });
  } catch (error) {
    yield put({type: ACTION_TYPES.SET_PUSH_TOKEN_FAILURE, error});
  }
}

function* uploadImages(action) {
  const {images, reject, resolve} = action.params;
  try {
    const formData = new FormData();

    images.map(img => {
      formData.append('images[]', {
        uri: img,
        name: getFileName(img),
        type: getFileExtension(img),
      });
    });

    const params = {
      body: formData,
      isBlob: true,
    };

    const response = yield call(API.uploadImages, params);
    yield resolve(response.data);
    yield put({
      type: ACTION_TYPES.UPLOAD_IMAGES_SUCCESS,
    });
  } catch (error) {
    yield reject(error);
    yield put({type: ACTION_TYPES.UPLOAD_IMAGES_FAILURE, error});
  }
}

function* saveUploads(action) {
  try {
    const params = {
      body: {
        ...action.params,
      },
    };
    const response = yield call(API.saveUploads, params);
    yield put({
      type: ACTION_TYPES.SAVE_UPLOADS_SUCCESS,
    });
  } catch (error) {
    yield put({type: ACTION_TYPES.SAVE_UPLOADS_FAILURE, error});
  }
}


// function* navigate(action) {
//   try {
//     yield NavigationService.navigate(action.scene,
//       {
//         params: action.params,
//       }
//     );
//   } catch (error) {
//   }
// }

function* bootMonitor() {
  yield takeLatest(ACTION_TYPES.BOOT_REQUEST, boot);
}

function* bootstrapMonitor() {
  yield takeLatest(ACTION_TYPES.BOOTSTRAPPED, bootstrapped);
}

function* changeCountryMonitor() {
  yield takeLatest(ACTION_TYPES.CHANGE_COUNTRY, changeCountrySaga);
}

export function* setLanguageMonitor() {
  yield takeLatest(ACTION_TYPES.SET_LANGUAGE_REQUEST, setLanguage);
}

export function* setPushTokenMonitor() {
  yield takeLatest(ACTION_TYPES.SET_PUSH_TOKEN_REQUEST, setPushToken);
}

// export function* navigationMonitor() {
//   yield takeLatest(ACTION_TYPES.NAVIGATE, navigate);
// }

function* uploadImageMonitor() {
  yield takeLatest(ACTION_TYPES.UPLOAD_IMAGES_REQUEST, uploadImages);
}
function* saveUploadsMonitor() {
  yield takeLatest(ACTION_TYPES.SAVE_UPLOADS_REQUEST, saveUploads);
}



const APP_SAGA = all([
  fork(bootMonitor),
  fork(bootstrapMonitor),
  fork(changeCountryMonitor),
  fork(setLanguageMonitor),
  fork(setPushTokenMonitor),
  fork(uploadImageMonitor),
  fork(saveUploadsMonitor)
  // fork(navigationMonitor),
]);

export default APP_SAGA;
