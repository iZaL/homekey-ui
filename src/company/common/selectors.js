import orm from '../../common/orm';
import {createSelector} from 'reselect';
import {createSelector as ormSelector} from 'redux-orm';
import {SELECTORS as APP_SELECTORS} from './../../app/common/selectors';
const ormReducer = state => state.ormReducer;

// Company Selectors
const domesticCompaniesResults = state => state.companyReducer.domesticResults;
const isDomesticFetching = state => state.companyReducer.isDomesticFetching;
const getCompanyID = (state, props) =>
  props.navigation.state.params.company._id;

// const getProperties = createSelector(
//   ormReducer,
//   propertyResults,
//   APP_SELECTORS.getCountries,
//   ormSelector(orm, (ormSession, results, countries) =>
//     filterResults(ormSession, results, countries),
//   ),
// );

// const filterResults = ({Property, User}, results, countries) =>
//   results.map(id => {
//     const property = Property.withId(id);
//     if(property) {
//       return resolveProperty(property.ref, User, countries);
//     }
//   });

// const resolveProperty = (property, User, countries) => {
//   let title;
//   let {category, type, address} = property;
//
//   title = ` ${I18n.t([category])} ${I18n.t([type])} ${I18n.t('in')} ${isRTL
//     ? address.city_ar
//     : address.city_en}`;
//
//   return Object.assign({}, property, {
//     user: User.idExists(property.user) ? User.withId(property.user).ref : {},
//     title: title,
//     country: countries.find(country => country.id === address.country),
//   });
// };

const getDomesticCompanies = createSelector(
  ormReducer,
  domesticCompaniesResults,
  ormSelector(orm, ({User}, results) =>
    results.map(userID => User.withId(userID).ref),
  ),
);
const getCompany = createSelector(
  ormReducer,
  getCompanyID,
  APP_SELECTORS.getCountries,
  ormSelector(orm, ({Company}, id) => Company.withId(id).ref),
);

const getIsDomesticFetching = createSelector(
  isDomesticFetching,
  isFetching => isFetching,
);
export const SELECTORS = {
  getIsDomesticFetching,
  getDomesticCompanies,
  getCompany,
};
