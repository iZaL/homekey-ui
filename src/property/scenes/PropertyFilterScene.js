import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import colors from '../../common/colors';
import List from '../components/filters/List';
import Button from '../components/filters/Button';
import Separator from '../../components/Separator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import isEmpty from 'lodash/isEmpty';
import NavBar from '../../components/NavBar';
import NavButton from '../../components/NavButton';
import CountryPicker from '../components/filters/CountryPicker';
import {CountryPropType} from '../common/proptypes';
import I18n,{isRTL} from './../../app/common/locale';

import {TabBar, TabViewAnimated, TabViewPagerPan} from 'react-native-tab-view';

export default class PropertyFilterScene extends Component {
  static propTypes = {
    filters: PropTypes.object.isRequired,
    onPriceFromSelect: PropTypes.func.isRequired,
    onPriceToSelect: PropTypes.func.isRequired,
    onSearchPress: PropTypes.func.isRequired,
    onShowSearch: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    country: CountryPropType.isRequired,
    onNavigateBack: PropTypes.func.isRequired,
    onCountryChange: PropTypes.func.isRequired,
    onCategorySelect: PropTypes.func.isRequired,
    countries: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    onTypeChange: PropTypes.func.isRequired,
    propertyType: PropTypes.string.isRequired,
    searchMetas: PropTypes.object.isRequired,
  };

  toggleMenuVisible = value => {
    this.setState({
      menuIsVisible: value,
    });
  };

  constructor(props) {
    super(props);
    let selectedIndex = this.getTabIndex();
    this.state = {
      menuValue: new Animated.Value(0),
      menuIsVisible: false,
      tabs: {
        index: selectedIndex,
        routes: [
          {key: '1', title: I18n.t('for_sale')},
          {key: '2', title: I18n.t('for_rent')},
          {key: '3', title: I18n.t('for_share')},
        ],
        loaded: false,
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.propertyType !== this.props.propertyType) {
      let selectedIndex = this.getTabIndex();
      if (this.state.tabs.index !== selectedIndex) {
        this.setState({
          tabs: {
            ...this.state.tabs,
            index: selectedIndex,
          },
        });
      }
    }
  }

  getTabIndex() {
    let selectedIndex;
    switch (this.props.propertyType) {
      case 'for_sale':
        selectedIndex = 0;
        break;
      case 'for_rent':
        selectedIndex = 1;
        break;
      case 'for_share':
        selectedIndex = 2;
        break;
      default:
        selectedIndex = 0;
        break;
    }
    return selectedIndex;
  }

  handleChangeTab = index => {
    let selectedType;
    switch (index) {
      case 0:
        selectedType = 'for_sale';
        break;
      case 1:
        selectedType = 'for_rent';
        break;
      case 2:
        selectedType = 'for_share';
        break;
      default:
        break;
    }
    this.props.onTypeChange(selectedType);
  };

  renderScene = () => {
    let {
      priceFrom,
      priceTo,
      bedroom,
      bathroom,
      parking,
      category,
    } = this.props.filters;

    let {
      onPriceFromSelect,
      onPriceToSelect,
      onCategorySelect,
      onMetaSelect,
      country,
      categories,
      prices,
    } = this.props;

    let {bedroomsArr, bathroomsArr, parkingArr} = this.props.searchMetas;

    return (
      <ScrollView
        style={[styles.container]}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        contentInset={{bottom: 80}}>
        <List
          selected={category}
          onSelect={onCategorySelect}
          ranges={categories}
          title={I18n.t('property_type')}
        />

        <Separator style={{marginBottom: 20}} />

        <List
          title={I18n.t('price_range')}
          ranges={prices}
          selected={priceFrom}
          onSelect={onPriceFromSelect}
          hint={country.currency}
        />

        <List
          title={I18n.t('to')}
          ranges={prices}
          selected={priceTo}
          onSelect={onPriceToSelect}
          titleStyle={{
            fontSize: 12,
            color: colors.primary,
            fontWeight: '400',
          }}
          hint={country.currency}
        />

        <Separator style={{marginBottom: 20}} />

        <Button
          title={I18n.t('bed')}
          icon="bed"
          onPress={value => onMetaSelect('bedroom', value)}
          range={bedroomsArr}
          selected={bedroom}
        />

        <Separator style={{marginTop: 20, marginBottom: 20}} />

        <Button
          title={I18n.t('bath')}
          icon="bath"
          onPress={value => onMetaSelect('bathroom', value)}
          range={bathroomsArr}
          selected={bathroom}
        />

        <Separator style={{marginTop: 20, marginBottom: 20}} />

        <Button
          title={I18n.t('parking')}
          icon="car"
          onPress={value => onMetaSelect('parking', value)}
          range={parkingArr}
          selected={parking}
        />
      </ScrollView>
    );
  };

  renderHeader = props => {
    return (
      <TabBar
        {...props}
        scrollEnabled
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        labelStyle={styles.label}
      />
    );
  };

  renderPager = props => {
    return (
      <TabViewPagerPan
        {...props}
        swipeEnabled={false}
        animationEnabled={true}

      />
    );
  };

  renderSearchBar = () => {
    let {onShowSearch, onSearch} = this.props;

    let {searchString} = this.props.filters;

    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 5,
          paddingVertical: 10,
          alignItems: 'center',
        }}>
        <Ionicons
          name="ios-search"
          size={24}
          color={colors.darkGrey}
          style={{height: 24, width: 24, paddingHorizontal: 5}}
        />
        <TouchableWithoutFeedback onPress={() => onShowSearch()}>
          <View
            style={{
              flex: 1,
              padding: 8,
              backgroundColor: '#E3E3E3',
              borderRadius: 30,
            }}>
            {isEmpty(searchString) ? (
              <Text
                style={{
                  padding: 3,
                  paddingLeft: 10,
                  fontWeight: '500',
                  color: colors.darkGrey,
                  textAlign: 'left',
                }}>
                {I18n.t('search_by_location')}
              </Text>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    flex: 1,
                    padding: 3,
                    paddingLeft: 10,
                    fontWeight: '500',
                    color: colors.darkGrey,
                    textAlign: 'left',
                  }}>
                  {searchString}
                </Text>
                <TouchableHighlight
                  onPress={() => onSearch('')}
                  style={styles.closeButtonContainer}>
                  <Ionicons
                    name="ios-close-circle-outline"
                    size={16}
                    color={colors.primary}
                  />
                </TouchableHighlight>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  render() {
    const {
      onSearchPress,
      onNavigateBack,
      onCountryChange,
      countries,
      country,
      filters,
      propertyType,
    } = this.props;

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <NavBar
          right={
            <NavButton
              icon="ios-close"
              onPress={onNavigateBack}
              style={isRTL ? {marginRight: 5} : {marginRight: -10}}
            />
          }
          left={
            <CountryPicker
              {...this.state}
              toggleMenuVisible={this.toggleMenuVisible}
              countries={countries}
              country={country}
              changeCountry={onCountryChange}
            />
          }
        />

        {this.renderSearchBar()}

        <Separator />

        <TabViewAnimated
          // propertyType={propertyType}
          // filters={filters}
          style={{flex: 1}}
          navigationState={this.state.tabs}
          renderScene={this.renderScene}
          renderHeader={this.renderHeader}
          renderPager={this.renderPager}
          onIndexChange={this.handleChangeTab}
          scrollEnabled={false}
        />

        <TouchableHighlight
          underlayColor="transparent"
          onPress={onSearchPress}
          style={styles.footer}>
          <Text style={styles.footerText}>{I18n.t('apply_filter')}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  footer: {
    backgroundColor: colors.primary,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
  },
  closeButtonContainer: {
    paddingBottom: 4,
    paddingTop: 4,
    paddingLeft: 10,
    paddingRight: 10,
  },
  globeIcon: {
    paddingLeft: 5,
  },
  tabbar: {
    backgroundColor: 'white',
  },
  indicator: {
    height: 2,
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.darkGrey,
    fontWeight: '400',
  },
});
