/**
 * @flow
 */
import React, {Component} from 'react';
import {View} from 'react-native';
import PropertyFilterScene from './scenes/PropertyFilterScene';
import LocationSearchScene from './scenes/LocationSearchScene';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ACTIONS} from './common/actions';
import {ACTIONS as APP_ACTIONS} from './../app/common/actions';
import {SELECTORS} from './common/selectors';
import {SELECTORS as APP_SELECTORS} from './../app/common/selectors';
import I18n from './../app/common/locale';

class PropertyFilter extends Component {
  state = {
    searchMode: false,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handleButtonPress: this.loadPropertyScene,
    });
  }

  loadPropertyScene = () => {
    this.props.navigation.goBack();
  };

  updateFilterProps = (field, item) => {
    let {propertyType} = this.props;
    return this.props.actions.updateFilter({
      propertyType: propertyType.key,
      field,
      value: item.key,
    });
  };

  changePropertyType = value => {
    this.props.actions.changePropertyType(value);
  };

  onCategorySelect = value => {
    this.updateFilterProps('category', value);
  };

  onPriceFromSelect = value => {
    this.updateFilterProps('priceFrom', value);
  };

  onPriceToSelect = value => {
    this.updateFilterProps('priceTo', value);
  };

  onMetaSelect = (field, value) => {
    this.updateFilterProps(field, value);
  };

  onSearch = value => {
    this.updateFilterProps('searchString', {key: value});
  };

  showSearch = () => {
    return this.setState({
      searchMode: true,
    });
  };

  hideSearch = value => {
    if (!value.getAddressText()) {
      this.updateFilterProps('searchString', '');
    }
    this.setState({
      searchMode: false,
    });
  };

  search = () => {
    this.props.navigation.goBack();
    this.props.actions.resetProperty();
    this.props.actions.fetchProperties();
  };

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  changeCountry = country => {
    this.props.actions.changeMapView('list');
    this.props.actions.changeCountry(country);
  };

  changeType = type => {
    this.props.actions.changePropertyType(type);
  };

  render() {
    const {
      categories,
      filters,
      country,
      countries,
      propertyType,
      propertyTypes,
      prices,
      searchMetas,
    } = this.props;
    console.log('filter');

    const {searchMode} = this.state;

    let currentCategories = categories[propertyType.key];
    let any = [{key: 'any', value: I18n.t('any')}];
    let categoriesWithAny = any.concat(currentCategories);

    return (
      <View style={{flex: 1}}>
        {searchMode ? (
          <LocationSearchScene
            searchString={this.props.filters.searchString}
            onSearch={this.onSearch}
            country={country}
            onLeftButtonPress={this.goBack}
            onRightButtonPress={this.hideSearch}
          />
        ) : (
          <PropertyFilterScene
            changeActiveTab={this.changePropertyType}
            onSearch={this.onSearch}
            onPriceFromSelect={this.onPriceFromSelect}
            onPriceToSelect={this.onPriceToSelect}
            onMetaSelect={this.onMetaSelect}
            onSearchPress={this.search}
            onCategorySelect={this.onCategorySelect}
            onShowSearch={this.showSearch}
            onNavigateBack={this.goBack}
            onCountryChange={this.changeCountry}
            onTypeChange={this.changeType}
            propertyType={propertyType}
            propertyTypes={propertyTypes}
            categories={categoriesWithAny}
            country={country}
            countries={countries}
            filters={filters}
            prices={prices}
            searchMetas={searchMetas}
          />
        )}
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...ACTIONS, ...APP_ACTIONS}, dispatch)};
}

function mapStateToProps(state) {
  return {
    categories: SELECTORS.getCategories(state),
    prices: SELECTORS.getPrices(state),
    filters: SELECTORS.getFilters(state),
    country: APP_SELECTORS.getSelectedCountry(state),
    countries: APP_SELECTORS.getCountries(state),
    propertyType: SELECTORS.getSelectedPropertyType(state),
    propertyTypes: SELECTORS.getPropertyTypes(state),
    searchMetas: SELECTORS.getSearchMetas(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyFilter);
