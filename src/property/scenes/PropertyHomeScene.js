/**
 @flow
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import colors from '../../common/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import isEmpty from 'lodash/isEmpty';
import CountryPicker from '../components/filters/CountryPicker';
import HistoryList from '../components/HistoryList';
import I18n from './../../app/common/locale';
import sample from 'lodash/sample';

const TAB_BAR_HEIGHT = 90;
const STATUS_BAR_HEIGHT = 20;

export default class PropertyHomeScene extends Component {
  static propTypes = {
    openSearchScene: PropTypes.func.isRequired,
    changeActiveTab: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    removeFilter: PropTypes.func.isRequired,
    loadPropertyScene: PropTypes.func.isRequired,
    propertyType: PropTypes.object.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    countrySelectScene: PropTypes.func.isRequired,
  };

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

    let randomImages = [
      require('./../../../assets/home-bg/bg1.png'),
      require('./../../../assets/home-bg/bg2.png'),
      require('./../../../assets/home-bg/bg3.png'),
      require('./../../../assets/home-bg/bg4.png'),
    ];

    this.bgImage = sample(randomImages);
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

  toggleMenuVisible = value => {
    // this.props.countrySelectScene(value);
  };

  changeTab = name => {
    this.props.changeActiveTab(name);
  };

  openSearchScene = () => {
    this.props.openSearchScene();
  };

  renderHeader = () => {
    let {scrollY} = this.state;

    let logoScale = scrollY.interpolate({
      inputRange: [-50, 0, 50],
      outputRange: [1.5, 1, 1],
    });

    return (
      <View style={styles.hero}>
        <Animated.Image
          source={this.bgImage}
          style={[
            styles.countryImage,
            {
              transform: [{scale: logoScale}],
            },
          ]}
          resizeMode="cover"
        />
      </View>
    );
  };

  renderTabs() {
    let {propertyType, propertyTypes} = this.props;
    let {clampedScroll} = this.state;

    const tabBarTranslate = clampedScroll.interpolate({
      inputRange: [0, TAB_BAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [0, -(TAB_BAR_HEIGHT - STATUS_BAR_HEIGHT)],
      extrapolate: 'clamp',
    });
    const tabBarOpacity = clampedScroll.interpolate({
      inputRange: [0, TAB_BAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    let {filters} = this.props;

    return (
      <Animated.View
        style={[
          styles.searchBar,
          {
            transform: [{translateY: tabBarTranslate}],
            opacity: tabBarOpacity,
          },
        ]}>
        <View style={styles.searchTabs}>
          {propertyTypes.map(type => {
            let title = '';
            if (type.key === 'for_sale') {
              title = I18n.t('buy');
            } else if (type.key === 'for_share') {
              title = I18n.t('share');
            } else if (type.key === 'for_rent') {
              title = I18n.t('rent');
            }

            return (
              <TouchableHighlight
                key={type.key}
                underlayColor="transparent"
                onPress={() => this.changeTab(type.key)}
                style={[
                  styles.tab,
                  propertyType.key === type.key && styles.tabActive,
                ]}>
                <Text
                  style={[
                    styles.tabTitle,
                    propertyType.key === type.key && styles.tabTitleActive,
                  ]}>
                  {title}
                </Text>
              </TouchableHighlight>
            );
          })}
        </View>

        <TouchableHighlight
          style={styles.searchInput}
          onPress={() => this.openSearchScene()}
          underlayColor={colors.lightGrey}
          activeOpacity={0.5}>
          <View style={styles.textInput}>
            {/*<Ionicons*/}
              {/*name="ios-search"*/}
              {/*size={25}*/}
              {/*color={colors.darkGrey}*/}
              {/*style={[styles.searchIcon]}*/}
            {/*/>*/}
            <Text style={styles.searchText}>
              {filters && filters.searchString
                ? filters.searchString
                : I18n.t('search')}
            </Text>
            <Text>
              {filters &&
                filters.searchString && (
                  <Ionicons
                    name="ios-close-outline"
                    size={40}
                    color={colors.darkGrey}
                    style={[styles.searchIcon, {height: 30}]}
                  />
                )}
            </Text>
          </View>
        </TouchableHighlight>
      </Animated.View>
    );
  }

  render() {
    let {scrollY} = this.state;

    let {
      searchHistory,
      setFilter,
      countries,
      country,
      onCountryChange,
      removeFilter,
    } = this.props;

    let emptyIcon = require('./../../../assets/logo.png');

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderTabs()}

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={1}
          onMomentumScrollBegin={this._onMomentumScrollBegin}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          onScrollEndDrag={this._onScrollEndDrag}
          style={StyleSheet.absoluteFill}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {
              useNativeDriver: true,
            },
          )}>
          <View style={styles.heroSpacer} />
          <View style={styles.contentContainerStyle}>
            <View
              style={{
                paddingHorizontal: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={[styles.historyTitle]}>
                {I18n.t('search_history')}
              </Text>
              <CountryPicker
                {...this.state}
                toggleMenuVisible={this.toggleMenuVisible}
                countries={countries}
                country={country}
                changeCountry={onCountryChange}
              />
            </View>
            <View style={styles.historyContainer}>
              {isEmpty(searchHistory) ? (
                <TouchableHighlight
                  onPress={() => {}}
                  underlayColor="transparent">
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      marginVertical: 30,
                    }}>
                    <Image
                      source={emptyIcon}
                      style={{height: 125}}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableHighlight>
              ) : (
                <HistoryList
                  collection={searchHistory}
                  setFilter={setFilter}
                  removeFilter={removeFilter}
                  countries={countries}
                />
              )}
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    );
  }
}

const HeroHeight = 350;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  countryImage: {
    flex: 1,
    width: null,
    height: null,
  },
  contentContainerStyle: {
    backgroundColor: 'white',
  },
  searchBar: {
    position: 'absolute',
    top: 25,
    height: 90,
    backgroundColor: 'white',
    marginHorizontal: 10,
    opacity: 1,
    shadowColor: colors.fadedBlack,
    shadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    shadowRadius: 5,
    shadowOpacity: 0.8,
    borderRadius: 2,
    zIndex: 5000,
  },
  searchTabs: {
    flex: 1,
    flexDirection: 'row',
    width: Dimensions.get('window').width - 20,
  },
  searchInput: {
    flex: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    height: 40,
  },
  tabActive: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 1,
  },
  textInput: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: '500',
  },
  tabTitleActive: {
    color: colors.primary,
  },
  searchText: {
    flex: 1,
    color: 'black',
    paddingHorizontal: 10,
    fontSize: 20,
    textAlign: 'left',
    fontWeight: '300',
    marginTop: -3,
  },
  historyTitle: {
    color: 'black',
    fontWeight: '500',
    fontSize: 20,
    textAlign: 'left',
    // paddingTop:10
  },
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HeroHeight,
  },
  heroSpacer: {
    height: HeroHeight,
    backgroundColor: 'transparent',
  },
});
