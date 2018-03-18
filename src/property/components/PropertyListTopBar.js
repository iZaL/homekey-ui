/**
 @flow
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {View, Animated} from 'react-native';
import SortBar from './SortBar';
import ResultHint from './ResultHint';
import EmptyResult from './EmptyResult';
import {CountryPropType} from './../common/proptypes';

const TAB_BAR_HEIGHT = 90;
const STATUS_BAR_HEIGHT = 20;

export default class PropertyListTopBar extends Component {
  static propTypes = {
    mapView: PropTypes.bool.isRequired,
    onMapViewPress: PropTypes.func.isRequired,
    sortOptions: PropTypes.array.isRequired,
    selectedSortOption: PropTypes.string.isRequired,
    onSortItemPress: PropTypes.func.isRequired,
    showRelated: PropTypes.bool.isRequired,
    propertyType: PropTypes.object.isRequired,
    country: CountryPropType.isRequired,
    isFetching: PropTypes.bool.isRequired,
    searchLocation: PropTypes.string,
    isRelatedFetching: PropTypes.bool.isRequired,
    relatedProperties: PropTypes.array.isRequired,
    location: PropTypes.string.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.mapView !== this.props.mapView || nextProps.selectedSortOption !== this.selectedSortOption
  }

  constructor(props) {
    super(props);

    const scrollY = new Animated.Value(0);
    const menuValue = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);

    this.state = {
      menuIsVisible: false,
      menuValue,
      scrollY,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollY.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          offsetAnim,
        ),
        0,
        TAB_BAR_HEIGHT - STATUS_BAR_HEIGHT,
      ),
    };
  }

  _clampedScrollValue = 0;
  _offsetValue = 0;
  _scrollValue = 0;

  componentDidMount() {
    this.state.scrollY.addListener(({value}) => {
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._clampedScrollValue = Math.min(
        Math.max(this._clampedScrollValue + diff, 0),
        TAB_BAR_HEIGHT - STATUS_BAR_HEIGHT,
      );
    });
    this.state.offsetAnim.addListener(({value}) => {
      this._offsetValue = value;
    });
  }

  componentWillUnmount() {
    this.state.scrollY.removeAllListeners();
    this.state.offsetAnim.removeAllListeners();
  }

  _onScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  _onMomentumScrollBegin = () => {
    clearTimeout(this._scrollEndTimer);
  };

  _onMomentumScrollEnd = () => {
    const toValue =
      this._scrollValue > TAB_BAR_HEIGHT &&
      this._clampedScrollValue > (TAB_BAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
        ? this._offsetValue + TAB_BAR_HEIGHT
        : this._offsetValue - TAB_BAR_HEIGHT;

    Animated.timing(this.state.offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  render() {
    let {
      mapView,
      sortOptions,
      selectedSortOption,
      onSortItemPress,
      country,
      showRelated,
      propertyType,
      location,
      isFetching,
      isRelatedFetching,
      relatedProperties,
      onMapViewPress,
    } = this.props;

    console.log('topbar');
    return (
      <View>
        <SortBar
          onMapViewPress={onMapViewPress}
          mapView={mapView}
          sortOptions={sortOptions}
          selectedSortOption={selectedSortOption}
          onSortItemPress={onSortItemPress}
        />
        {!showRelated && (
          <ResultHint
            country={country}
            propertyType={propertyType.key}
            searchLocation={location}
            isFetching={isFetching}
          />
        )}

        {showRelated &&
          !isRelatedFetching && (
            <EmptyResult
              country={country}
              propertyType={propertyType.key}
              searchLocation={location}
              hasRelatedProperties={relatedProperties.length > 0}
            />
          )}
      </View>
    );
  }
}
