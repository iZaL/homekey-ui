import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {ActionSheetIOS, Linking} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ACTIONS} from './common/actions';
import {SELECTORS} from './common/selectors';
import {SELECTORS as APP_SELECTORS} from './../app/common/selectors';
import PropertyDetailScene from './scenes/PropertyDetailScene';
import {SELECTORS as AUTH_SELECTORS} from '../auth/common/selectors';
import I18n from './../app/common/locale';

class PropertyDetail extends Component {
  static propTypes = {
    property: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static navigationOptions = ({navigation}) => {
    return {
      header: navigation.state.params.visibility,
      title: navigation.state.params.title,
    };
  };

  state = {
    sceneType: 'detailScene',
  };

  // shouldComponentUpdate(nextProps) {
  // return nextProps.property !== this.props.property;
  // }

  componentDidMount() {
    this.props.navigation.setParams({
      visibility: undefined,
    });
    this.props.actions.incrementViews(this.props.property._id);
  }

  handleFavoritePress = (property: object) => {
    this.props.actions.favoriteProperty(property);
  };

  loadProfile = (user: object) => {
    const {navigation} = this.props;
    navigation.navigate('ProfileScene', {
      user: user,
    });
  };

  // onPinPress = () => {
  //   this.followLocation();
  // };

  setSceneType = type => {
    if (type === 'detailScene') {
      this.props.navigation.setParams({
        visibility: undefined,
      });
    } else {
      this.props.navigation.setParams({
        visibility: false,
      });
    }

    this.setState({
      sceneType: type,
    });
  };

  followLocation = () => {
    const {property} = this.props;
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: `${property.title}`,
        options: [
          I18n.t('open_in_apple_maps'),
          I18n.t('open_in_google_maps'),
          I18n.t('cancel'),
        ],
        destructiveButtonIndex: -1,
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        this.openMaps(property, buttonIndex);
      },
    );
  };

  openMaps(property, buttonIndex) {
    let address = encodeURIComponent(
      `${property.address.city_en},${property.address.country}`,
    );
    switch (buttonIndex) {
      case 0:
        Linking.openURL(
          `http://maps.apple.com/?dll=${property.address.latitude},${
            property.address.longitude
          }`,
        );
        break;
      case 1:
        const nativeGoogleUrl = `comgooglemaps://?daddr=${
          property.address.latitude
        },${property.address.longitude}&center=${property.address.latitude},${
          property.address.longitude
        }&zoom=14&views=traffic&directionsmode=driving`;
        Linking.canOpenURL(nativeGoogleUrl).then(supported => {
          const url = supported
            ? nativeGoogleUrl
            : `http://maps.google.com/?q=loc:${property.address.latitude}+${
                property.address.longitude
              }`;
          Linking.openURL(url);
        });
        break;
    }
  }

  initiateChat = () => {
    const {navigation, property} = this.props;
    navigation.navigate('ChatScene', {
      property: property,
    });
  };

  render() {
    const {property, country, countries, currentUserID} = this.props;
    let {sceneType} = this.state;
    return (
      <PropertyDetailScene
        property={property}
        sceneType={sceneType}
        handleFavoritePress={this.handleFavoritePress}
        loadProfile={this.loadProfile}
        onPinPress={this.followLocation}
        setSceneType={this.setSceneType}
        country={country}
        countries={countries}
        initiateChat={this.initiateChat}
        currentUserID={currentUserID}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...ACTIONS}, dispatch)};
}

function mapStateToProps(state, props) {
  return {
    property: SELECTORS.getProperty(state, props),
    country: APP_SELECTORS.getSelectedCountry(state),
    countries: APP_SELECTORS.getCountries(state),
    currentUserID: AUTH_SELECTORS.getCurrentUserID(state) || '0',
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PropertyDetail);
