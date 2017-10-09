import orm from '../../common/orm';
import {createSelector} from 'reselect';
import {createSelector as ormSelector} from 'redux-orm';
import {SELECTORS as APP_SELECTORS} from './../../app/common/selectors';
import {SELECTORS as AUTH_SELECTORS} from './../../auth/common/selectors';
import I18n, {isRTL} from './../../app/common/locale';
const ormReducer = state => state.ormReducer;

// Property Selectors
const propertyResults = state => state.propertyReducer.results;
const propertyRelatedResults = state => state.propertyReducer.relatedResults;
const userPropertyResults = state => state.userReducer.propertyResults;
const propertySelectedSortOption = state =>
  state.propertyReducer.selectedSortOption;
const propertySortOptions = state => state.propertyReducer.sortOptions;
const propertySaving = state => state.propertyReducer.isSaving;
const propertyIsFetching = state => state.propertyReducer.isFetching;
const propertyIsRelatedFetching = state =>
  state.propertyReducer.isRelatedFetching;
const propertyIsMyPropertiesFetching = state =>
  state.propertyReducer.isMyPropertiesFetching;
const propertyIsFavoritesFetching = state =>
  state.propertyReducer.isFavoritesFetching;
const propertyIsShowingRelated = state => state.propertyReducer.showRelated;
const propertyMapView = state => state.propertyReducer.mapView;
const propertyAddListing = state => state.propertyReducer.addListing;
const propertyEditListing = state => state.propertyReducer.editListing;
const propertySearchHistory = state => state.propertyHistoryReducer;
const getPropertyID = (state, props) =>
  props.navigation.state.params.property._id;
const getThreadID = (state, props) => props.navigation.state.params.thread_id;
const getUserID = (state, props) => props.navigation.state.params.user._id;

const resolveProperty = (property, User, countries) => {
  let title;
  let {category, type, address} = property;

  title = ` ${I18n.t([category])} ${I18n.t([type])} ${I18n.t('in')} ${isRTL
    ? address.city_ar
    : address.city_en}`;

  return Object.assign({}, property, {
    user: User.hasId(property.user) ? User.withId(property.user).ref : {},
    title: title,
    country: countries.find(country => country.id === address.country),
  });
};

const filterResults = ({Property, User}, results, countries) =>
  results.map(id => {
    const property = Property.withId(id);
    if (property) {
      return resolveProperty(property.ref, User, countries);
    }
  });

const getProperties = createSelector(
  ormReducer,
  propertyResults,
  APP_SELECTORS.getCountries,
  ormSelector(orm, (ormSession, results, countries) =>
    filterResults(ormSession, results, countries),
  ),
);

const getRelatedProperties = createSelector(
  ormReducer,
  propertyRelatedResults,
  APP_SELECTORS.getCountries,
  ormSelector(orm, (ormSession, results, countries) =>
    filterResults(ormSession, results, countries),
  ),
);

const getMyProperties = createSelector(
  ormReducer,
  AUTH_SELECTORS.getCurrentUserID,
  APP_SELECTORS.getCountries,
  ormSelector(orm, ({Property, User}, userID, countries) =>
    Property.all()
      .toRefArray()
      .filter(property => property.user === userID)
      .map(property => resolveProperty(property, User, countries)),
  ),
);

const getUserProperties = createSelector(
  ormReducer,
  userPropertyResults,
  APP_SELECTORS.getCountries,
  ormSelector(orm, (ormSession, results, countries) =>
    filterResults(ormSession, results, countries),
  ),
);

const getFavorites = createSelector(
  ormReducer,
  APP_SELECTORS.getCountries,
  ormSelector(orm, ({Property, User}, countries) =>
    Property.all()
      .toRefArray()
      .filter(property => property.isFavorited)
      .map(property => resolveProperty(property, User, countries)),
  ),
);

const getProperty = createSelector(
  ormReducer,
  getPropertyID,
  APP_SELECTORS.getCountries,
  ormSelector(orm, ({Property, User}, id, countries) => {
    const property = Property.withId(id).ref;
    return resolveProperty(property, User, countries);
  }),
);

const getPropertyThread = createSelector(
  ormReducer,
  getPropertyID,
  AUTH_SELECTORS.getCurrentUserID,
  ormSelector(orm, ({Thread}, propertyID, userID) => {
    return Thread.all()
      .toRefArray()
      .filter(thread => {
        return thread.property_id === propertyID && thread.user_ids
          ? thread.user_ids.includes(userID)
          : false;
      })[0];
  }),
);

const getThreads = createSelector(
  ormReducer,
  AUTH_SELECTORS.getCurrentUserID,
  ormSelector(orm, ({Thread}, userID) => {
    return Thread.all()
      .toRefArray()
      .filter(
        thread => (thread.user_ids ? thread.user_ids.includes(userID) : false),
      );
  }),
);

const getThreadDetail = createSelector(
  ormReducer,
  AUTH_SELECTORS.getCurrentUserID,
  getThreadID,
  ormSelector(orm, ({Thread}, userID, threadID) => {
    if (Thread.hasId(threadID)) {
      return Thread.withId(threadID).ref;
    } else {
      return {};
    }
  }),
);

const isFetching = createSelector(
  propertyIsFetching,
  isFetchingProperties => isFetchingProperties,
);
const isRelatedFetching = createSelector(
  propertyIsRelatedFetching,
  isFetchingRelated => isFetchingRelated,
);
const isMyPropertiesFetching = createSelector(
  propertyIsMyPropertiesFetching,
  isFetchingMyProperties => isFetchingMyProperties,
);
const isFavoritesFetching = createSelector(
  propertyIsFavoritesFetching,
  isFetchingFavorites => isFetchingFavorites,
);
const isShowingRelated = createSelector(
  propertyIsShowingRelated,
  showingRelated => showingRelated,
);
const getAddListing = createSelector(propertyAddListing, listings => listings);
const getEditListing = createSelector(
  propertyEditListing,
  listings => listings,
);
const getSaving = createSelector(propertySaving, saving => saving);
const getMapView = createSelector(propertyMapView, mapView => mapView);

// History Reducer
const getSearchHistory = createSelector(propertySearchHistory, history =>
  history
    .slice()
    .reverse()
    .slice(0, 20),
);

// Options reducer
const propertyTypes = state => state.propertyOptionsReducer.propertyTypes;
const selectedPropertyType = state =>
  state.propertyOptionsReducer.selectedPropertyType;
const propertyFilters = state => state.propertyOptionsReducer.filters;
const propertyGenders = state => state.propertyOptionsReducer.genders;
const propertyAmenities = state => state.propertyOptionsReducer.amenities;
const propertyNearByPlaces = state => state.propertyOptionsReducer.nearByPlaces;
const propertyAddMetas = state => state.propertyOptionsReducer.addMetas;
const propertySearchMetas = state => state.propertyOptionsReducer.searchMetas;
const propertyCategories = state => state.propertyOptionsReducer.categories;
const propertyPrices = state => state.propertyOptionsReducer.prices;

// Options Selectors
const getPropertyTypes = createSelector(propertyTypes, options => options);

const getSelectedPropertyType = createSelector(
  getPropertyTypes,
  selectedPropertyType,
  (types, selectedType) =>
    types.find(type => type.key === selectedType) || {key: undefined},
);

const getFilters = createSelector(
  propertyFilters,
  selectedPropertyType,
  (filters, type) => filters[type],
);
const getGenders = createSelector(propertyGenders, options => options);
const getAmenities = createSelector(propertyAmenities, options => options);
const getSortOptions = createSelector(propertySortOptions, options => options);
const getSelectedSortOption = createSelector(
  propertySelectedSortOption,
  selected => selected,
);

const getNearByPlaces = createSelector(
  propertyNearByPlaces,
  options => options,
);
const getAddMetas = createSelector(propertyAddMetas, options => options);
const getSearchMetas = createSelector(propertySearchMetas, options => options);
const getCategories = createSelector(
  propertyCategories,
  categories => categories,
);
const getPrices = createSelector(
  propertyPrices,
  selectedPropertyType,
  APP_SELECTORS.getSelectedCountry,
  (prices, type, country) => (prices[type] ? prices[type][country.abbr] : []),
);

export const SELECTORS = {
  isFetching,
  isFavoritesFetching,
  isRelatedFetching,
  isMyPropertiesFetching,
  getProperties,
  getMyProperties,
  getFavorites,
  getRelatedProperties,
  getProperty,
  getMapView,
  getSaving,
  isShowingRelated,
  getAddListing,
  getEditListing,

  getSearchHistory,

  getPropertyThread,
  getThreads,
  getThreadDetail,

  getPropertyTypes,
  getSelectedPropertyType,
  getFilters,
  getAmenities,
  getNearByPlaces,
  getGenders,
  getAddMetas,
  getSearchMetas,
  getSortOptions,
  getSelectedSortOption,
  getCategories,
  getPrices,
  getUserProperties,
};
