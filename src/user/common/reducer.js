import {ACTION_TYPES} from './actions';
import map from 'lodash/map';
import union from 'lodash/union';

const initialState = {
  isFetching: false,
  error: null,
  nextPageUrl: undefined,

  isPropertiesFetching: false,
  propertyResults: [],
  propertiesNextPageUrl: undefined,
};

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ACTION_TYPES.USER_REQUEST:
      return {...state, isFetching: true, error: null};
    case ACTION_TYPES.USER_SUCCESS:
      return {...state, isFetching: false, error: null};
    case ACTION_TYPES.USER_FAILURE:
      return {...state, isFetching: false, error: action.error};

    case ACTION_TYPES.USER_PROPERTIES_REQUEST:
      return {
        ...state,
        isPropertiesFetching: true,
        error: null,
      };
    case ACTION_TYPES.USER_PROPERTIES_SUCCESS: {
      let results = [];
      const companyCollections = action.payload.data;
      map(companyCollections, entity => {
        results.push(entity._id);
      });
      return {
        ...state,
        isPropertiesFetching: false,
        propertyResults: union(state.propertyResults, results),
        propertiesNextPageUrl: action.payload.next_page_url,
        error: null,
      };
    }
    case ACTION_TYPES.USER_PROPERTIES_FAILURE:
      return {...state, isPropertiesFetching: false, error: action.error};

    case ACTION_TYPES.DOMESTIC_COMPANIES_RESET:
      return {
        ...state,
        propertyResults: [],
        propertiesNextPageUrl: undefined,
      };
    case ACTION_TYPES.DOMESTIC_COMPANIES_RESET_NEXT_PAGE_URL:
      return {
        ...state,
        nextPageUrl: undefined,
      };
    case ACTION_TYPES.USER_PROPERTIES_RESET:
      return {
        ...state,
        propertyResults: [],
        propertiesNextPageUrl: undefined,
      };
    default:
      return state;
  }
}
