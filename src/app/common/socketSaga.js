import io from 'socket.io-client';
import {all, call, cancel, fork, put, select, take} from 'redux-saga/effects';
import {SOCKET_SERVER} from './../../env';
import {eventChannel} from 'redux-saga';
import {
  ACTION_TYPES as USER_ACTION_TYPES,
  ACTION_TYPES,
} from '../../user/common/actions';
import {ACTION_TYPES as AUTH_ACTION_TYPES} from '../../auth/common/actions';
import {SELECTORS as AUTH_SELECTORS} from '../../auth/common/selectors';

function connect() {
  const socket = io(SOCKET_SERVER);
  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
}

function subscribe(socket) {
  return eventChannel(emit => {
    socket.on('message.new', message => {
      let action = {
        type: ACTION_TYPES.SOCKET_RECEIVE_MESSAGE,
        payload: message,
      };
      emit(action);
    });
    return () => {};
  });
}

// read from server
function* read(socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

// write to server
function* addMessage(socket) {
  const state = yield select();
  const apiToken = AUTH_SELECTORS.getAuthToken(state);
  while (true) {
    const {params} = yield take(USER_ACTION_TYPES.SOCKET_EMIT_MESSAGE);
    const message = {
      api_token: apiToken,
      ...params.message,
    };
    socket.emit('message.new', message);
  }
}

//
function* syncUserToSocket(socket) {
  const state = yield select();
  const userID = AUTH_SELECTORS.getCurrentUserID(state);
  while (true) {
    yield take(USER_ACTION_TYPES.SYNC_USER_TO_SOCKET);
    socket.emit('user.connected', userID);
  }
}

//
function* subscribeUserToThread(socket) {
  while (true) {
    const threadParams = yield take(
      USER_ACTION_TYPES.SUBSCRIBE_TO_THREAD_SOCKET,
    );
    socket.emit('thread.subscribe', threadParams.params.thread_id);
  }
}

function* handleIO(socket) {
  yield fork(read, socket);
  yield fork(syncUserToSocket, socket);
  yield fork(subscribeUserToThread, socket);
  yield fork(addMessage, socket);
  yield put({
    type: USER_ACTION_TYPES.SYNC_USER_TO_SOCKET,
  });
}

function* socketFlow() {
  while (true) {
    yield take(AUTH_ACTION_TYPES.LOGIN_SUCCESS);

    const socket = yield call(connect);

    const task = yield fork(handleIO, socket);

    yield take(AUTH_ACTION_TYPES.LOGOUT);
    yield cancel(task);
    socket.emit('logout');
  }
}

const SOCKET_SAGA = all([fork(socketFlow)]);

export default SOCKET_SAGA;
