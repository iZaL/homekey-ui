import {ACTION_TYPES} from './actions';
import map from 'lodash/map';
import union from 'lodash/union';

const initialState = {
  isDomesticFetching: false,
  domesticNextPageUrl: undefined,
  domesticResults: [],

  isInternationalFetching: false,
  internationalNextPageUrl: undefined,
  internationalResults: [],
  error: null,
};

export default function companyReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ACTION_TYPES.DOMESTIC_COMPANIES_REQUEST:
      return {
        ...state,
        isDomesticFetching: true,
        error: null,
      };
    case ACTION_TYPES.DOMESTIC_COMPANIES_SUCCESS: {
      let results = [];
      const companyCollections = action.payload.data;
      map(companyCollections, entity => {
        results.push(entity._id);
      });
      return {
        ...state,
        isDomesticFetching: false,
        domesticResults: union(state.domesticResults, results),
        domesticNextPageUrl: action.payload.next_page_url,
        error: null,
      };
    }
    case ACTION_TYPES.DOMESTIC_COMPANIES_FAILURE:
      return {...state, isDomesticFetching: false, error: action.error};

    case ACTION_TYPES.DOMESTIC_COMPANIES_RESET:
      return {
        ...state,
        domesticResults: [],
        domesticNextPageUrl: undefined,
      };
    case ACTION_TYPES.DOMESTIC_COMPANIES_RESET_NEXT_PAGE_URL:
      return {
        ...state,
        domesticNextPageUrl: undefined,
      };

    default:
      return state;
  }
}
