import orm from '../../common/orm';
import {createSelector} from 'reselect';
import {createSelector as ormSelector} from 'redux-orm';

const ormReducer = state => state.ormReducer;
const getUserID = (state, props) => props.navigation.state.params.user._id;
const getIsUserPropertiesFetching = state =>
  state.userReducer.isPropertiesFetching;

const isUserPropertiesFetching = createSelector(
  getIsUserPropertiesFetching,
  isFetching => isFetching,
);

const getUser = createSelector(
  ormReducer,
  getUserID,
  ormSelector(orm, ({User}, id) => User.withId(id).ref),
);

export const SELECTORS = {
  getUser,
  isUserPropertiesFetching,
};
