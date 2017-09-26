import APP_SAGA from '../app/common/sagas';
import AUTH_SAGA from '../auth/common/sagas';
import USER_SAGA from '../user/common/sagas';
import PROPERTY_SAGA from '../property/common/sagas';
import SOCKET_SAGA from '../app/common/socketSaga';
import COMPANY_SAGA from '../company/common/sagas';
import {all} from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    APP_SAGA,
    AUTH_SAGA,
    PROPERTY_SAGA,
    USER_SAGA,
    COMPANY_SAGA,
    SOCKET_SAGA,
  ]);
}
