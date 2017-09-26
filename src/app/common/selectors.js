import {createSelector} from 'reselect';

const availableCountries = state => state.appReducer.countries;
const selectedCountry = state => state.appReducer.selectedCountry;

// const getCountries = createSelector(countries, (allCountries) => allCountries);
const getCountries = createSelector(availableCountries, countries => countries);
const getSelectedCountry = createSelector(
  availableCountries,
  selectedCountry,
  (countries, currentCountryID) =>
    countries.find(country => {
      return country.id === currentCountryID;
    }),
);

export const SELECTORS = {
  getCountries,
  getSelectedCountry,
};
