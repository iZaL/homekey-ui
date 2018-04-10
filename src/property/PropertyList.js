/**
 * @flow
 */
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ACTIONS} from './common/actions';
import {SELECTORS} from './common/selectors';
import {SELECTORS as APP_SELECTORS} from './../app/common/selectors';
import PropertyListScene from './scenes/PropertyListScene';
import PropertyMapScene from './scenes/PropertyMapScene';
import NavButton from '../components/NavButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from './../common/colors';
import {isRTL} from '../app/common/locale';
import PropertyListTopBar from './components/PropertyListTopBar';

class PropertyList extends PureComponent {
  static propTypes = {
    properties: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: (
        <NavButton
          icon={isRTL ? 'ios-arrow-forward' : 'ios-arrow-back'}
          style={[{width: 33, height: 33}, isRTL && {marginLeft: -15}]}
          iconSize={33}
          onPress={() =>
            navigation.state.params &&
            navigation.state.params.handleLeftButtonPress()
          }
        />
      ),
      headerRight: (
        <NavButton
          icon={<FontAwesome name="sliders" size={25} color={colors.primary} />}
          onPress={() =>
            navigation.state.params &&
            navigation.state.params.handleRightButtonPress()
          }
        />
      ),
    };
  };

  componentDidMount() {
    this.props.actions.fetchProperties();

    this.props.navigation.setParams({
      handleLeftButtonPress: this.loadHomeScene,
      handleRightButtonPress: this.loadFilterScene,
    });
  }

  loadHomeScene = () => {
    this.props.navigation.navigate('PropertyHomeScene');
  };

  loadFilterScene = () => {
    this.props.navigation.navigate('PropertyFilter');
  };

  loadScene = (property: object) => {
    this.props.navigation.navigate('PropertyDetailScene', {
      property: property,
    });
  };

  fetchProperties = () => {
    this.props.actions.fetchProperties();
  };

  handleFavoritePress = (property: object) => {
    this.props.actions.favoriteProperty(property);
  };

  refreshProperties = () => {
    this.props.actions.resetPropertyNextPageURL();
    this.props.actions.fetchProperties();
  };

  onSortItemPress = (option: object) => {
    if (option) {
      this.props.actions.setSortOption(option.key);
      this.props.actions.resetProperty();
      this.props.actions.fetchProperties();
    }
  };

  onMapViewPress = () => {
    this.props.actions.changeMapView();
  };

  render() {
    const {
      properties,
      isFetching,
      isRelatedFetching,
      mapView,
      country,
      showRelated,
      relatedProperties,
    } = this.props;

    console.log('list');

    return (
      <View style={{flex: 1}}>
        <PropertyListTopBar
          {...this.props}
          onMapViewPress={this.onMapViewPress}
          onSortItemPress={this.onSortItemPress}
        />

        {mapView ? (
          <PropertyMapScene
            collection={showRelated ? relatedProperties : properties}
            loadScene={this.loadScene}
            handleFavoritePress={this.handleFavoritePress}
            isFetching={showRelated ? isRelatedFetching : isFetching}
            fetchProperties={this.fetchProperties}
            followLocation={() => {}}
            country={country}
          />
        ) : (
          <PropertyListScene
            collection={showRelated ? relatedProperties : properties}
            loadScene={this.loadScene}
            handleFavoritePress={this.handleFavoritePress}
            isFetching={showRelated ? isRelatedFetching : isFetching}
            fetchProperties={this.fetchProperties}
            country={country}
            refreshProperties={this.refreshProperties}
          />
        )}
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...ACTIONS}, dispatch)};
}

function mapStateToProps(state) {
  return {
    properties: SELECTORS.getProperties(state),
    relatedProperties: SELECTORS.getRelatedProperties(state),
    isFetching: SELECTORS.isFetching(state),
    isRelatedFetching: SELECTORS.isRelatedFetching(state),
    mapView: SELECTORS.getMapView(state),
    country: APP_SELECTORS.getSelectedCountry(state),
    propertyType: SELECTORS.getSelectedPropertyType(state),
    location: SELECTORS.getFilters(state).searchString,
    showRelated: SELECTORS.isShowingRelated(state),
    sortOptions: SELECTORS.getSortOptions(state),
    selectedSortOption: SELECTORS.getSelectedSortOption(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyList);
