import {ACTION_TYPES} from './actions';
import {ACTION_TYPES as PROPERTY_ACTION_TYPES} from './../../property/common/actions';

export const COUNTRY_KEY = 'COUNTRY_KEY';
export const BOOTSTRAPPED_STORAGE_KEY = 'BOOTSTRAPPED';
export const LANGUAGE_STORAGE_KEY = 'APP_LOCALE';
export const PUSH_TOKEN_KEY = 'PUSH_TOKEN_KEY';

import I18n from './locale';
// // reducer
const initialState = {
  bootstrapped: false,
  booted: false,
  notifications: {
    message: null,
    messageType: null,
  },
  language: 'ar',
  selectedCountry: 'Kuwait',
  countries: [
    {
      id: 'Kuwait',
      abbr: 'KW',
      name: I18n.t('kuwait'),
      currency: I18n.t('kd'),
      coords: {
        latitude: 29.3759,
        longitude: 47.9774,
      },
    },
    {
      id: 'Bahrain',
      abbr: 'BH',
      name: I18n.t('bahrain'),
      currency: I18n.t('bd'),
      coords: {
        latitude: 26.0667,
        longitude: 50.5577,
      },
    },
    {
      id: 'Saudi Arabia',
      abbr: 'SA',
      name: I18n.t('saudi_arabia'),
      currency: I18n.t('sr'),
      coords: {
        latitude: 23.8859,
        longitude: 45.0792,
      },
    },
    {
      id: 'United Arab Emirates',
      abbr: 'AE',
      name: I18n.t('united_arab_emirates'),
      currency: I18n.t('dhs'),
      coords: {
        latitude: 26.0667,
        longitude: 50.5577,
      },
    },
    {
      id: 'Qatar',
      abbr: 'QA',
      name: I18n.t('qatar'),
      currency: I18n.t('qr'),
      coords: {
        latitude: 25.3548,
        longitude: 51.1839,
      },
    },
    {
      id: 'Oman',
      abbr: 'OM',
      name: I18n.t('oman'),
      currency: I18n.t('OMR'),
      coords: {
        latitude: 21.4735,
        longitude: 55.9754,
      },
    },
  ],
};

export default function appReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ACTION_TYPES.BOOTSTRAPPED:
      return {...state, bootstrapped: action.value};
    case ACTION_TYPES.BOOT_REQUEST:
      return {...state, booted: false};
    case ACTION_TYPES.BOOT_SUCCESS:
      return {...state, booted: true};
    case ACTION_TYPES.COUNTRY_CHANGED:
      return {...state, selectedCountry: action.country};
    case ACTION_TYPES.SET_NOTIFICATION:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          message: action.payload.message,
          messageType: action.payload.messageType,
        },
      };
    case ACTION_TYPES.DISMISS_NOTIFICATION:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          message: null,
          type: null,
        },
      };
    case PROPERTY_ACTION_TYPES.PROPERTY_SET_FILTERS_REQUEST:
      return {
        ...state,
        selectedCountry: action.filters.country,
      };
    case ACTION_TYPES.SET_LANGUAGE_SUCCESS:
      return {
        ...state,
        language: action.language,
      };
    default:
      return state;
  }
}
