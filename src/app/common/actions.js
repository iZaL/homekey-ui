export const ACTION_TYPES = {
  BOOT_REQUEST: 'BOOT_REQUEST',
  BOOT_SUCCESS: 'BOOT_SUCCESS',
  BOOTSTRAPPED: 'BOOTSTRAPPED',
  CHANGE_COUNTRY: 'CHANGE_COUNTRY',
  COUNTRY_CHANGED: 'COUNTRY_CHANGED',
  DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  SET_LANGUAGE_REQUEST: 'SET_LANGUAGE_REQUEST',
  SET_LANGUAGE_SUCCESS: 'SET_LANGUAGE_SUCCESS',
  SET_PUSH_TOKEN_REQUEST: 'SET_PUSH_TOKEN_REQUEST',
  SET_PUSH_TOKEN_SUCCESS: 'SET_PUSH_TOKEN_SUCCESS',
  SET_PUSH_TOKEN_FAILURE: 'SET_PUSH_TOKEN_FAILURE',
  NAVIGATE: 'NAVIGATE',

  UPLOAD_IMAGES_REQUEST: '@app/UPLOAD_IMAGES_REQUEST',
  UPLOAD_IMAGES_SUCCESS: '@app/UPLOAD_IMAGES_SUCCESS',
  UPLOAD_IMAGES_FAILURE: '@app/UPLOAD_IMAGES_FAILURE',

  SAVE_UPLOADS_REQUEST: '@app/SAVE_UPLOADS_REQUEST',
  SAVE_UPLOADS_SUCCESS: '@app/SAVE_UPLOADS_SUCCESS',
  SAVE_UPLOADS_FAILURE: '@app/SAVE_UPLOADS_FAILURE',
};

function boot() {
  return {
    type: ACTION_TYPES.BOOT_REQUEST,
  };
}

function changeCountry(country) {
  return {
    type: ACTION_TYPES.CHANGE_COUNTRY,
    country,
  };
}
function setBootstrapped(value) {
  return {
    type: ACTION_TYPES.BOOTSTRAPPED,
    value,
  };
}
function setLanguage(value) {
  return {
    type: ACTION_TYPES.SET_LANGUAGE_REQUEST,
    language: value,
  };
}

function dismissNotification() {
  return {
    type: ACTION_TYPES.DISMISS_NOTIFICATION,
  };
}

function setNotification(message, messageType) {
  return {
    type: ACTION_TYPES.SET_NOTIFICATION,
    payload: {
      message: message,
      messageType: messageType,
    },
  };
}

function setPushToken(token) {
  return {
    type: ACTION_TYPES.SET_PUSH_TOKEN_REQUEST,
    params: token,
  };
}

function navigateToScene(scene, params) {
  return {
    type: ACTION_TYPES.NAVIGATE,
    scene,
    params,
  };
}

function uploadImages(params) {
  return {
    type: ACTION_TYPES.UPLOAD_IMAGES_REQUEST,
    params,
  };
}

function saveUploads(params) {
  return {
    type: ACTION_TYPES.SAVE_UPLOADS_REQUEST,
    params,
  };
}

export const ACTIONS = {
  boot,
  changeCountry,
  dismissNotification,
  setNotification,
  setBootstrapped,
  setLanguage,
  setPushToken,
  navigateToScene,
  uploadImages,
  saveUploads,
};
