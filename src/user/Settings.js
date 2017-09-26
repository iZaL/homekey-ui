/**
 * @flow
 */
import React, {Component} from 'react';
import {Alert} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SELECTORS as AUTH_SELECTORS} from '../auth/common/selectors';
import {SELECTORS as APP_SELECTORS} from '../app/common/selectors';
import {ACTIONS as AUTH_ACTIONS} from '../auth/common/actions';
import {ACTIONS as APP_ACTIONS} from '../app/common/actions';
import {ACTIONS as PROPERTY_ACTIONS} from '../property/common/actions';
import SettingsScene from './scenes/SettingsScene';
import I18n from './../app/common/locale';

class SettingList extends Component {
  loadScene = (route = null) => {
    const {navigation, user} = this.props;
    switch (route) {
      case 'user':
        return navigation.navigate('UserDetailScene', {
          user,
        });
      case 'propertyCreate':
        return navigation.navigate('PropertyCreateScene');
      case 'manageProperties':
        return navigation.navigate('PropertyManager');
      case 'login':
        return navigation.navigate('Login');
      case 'chat':
        return navigation.navigate('ChatListScene');
      case 'logout': {
        return Alert.alert(I18n.t('logout'), '', [
          {text: I18n.t('cancel')},
          {
            text: I18n.t('yes'),
            onPress: () => {
              this.props.actions.logout();
            },
          },
        ]);
      }
      case 'countrySelect': {
        return navigation.navigate('CountryListScene');
      }
      case 'languageSelect': {
        return navigation.navigate('SelectLanguageScene');
      }
      default:
        return;
    }
  };

  changeCountry = country => {
    this.props.actions.changeCountry(country);
    this.props.navigator.pop();
  };

  render() {
    const {isAuthenticated, user, country} = this.props;
    return (
      <SettingsScene
        isAuthenticated={isAuthenticated}
        user={user}
        country={country}
        loadScene={this.loadScene}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {...AUTH_ACTIONS, ...PROPERTY_ACTIONS, ...APP_ACTIONS},
      dispatch,
    ),
  };
}

function mapStateToProps(state) {
  return {
    isAuthenticated: AUTH_SELECTORS.isAuthenticated(state),
    user: AUTH_SELECTORS.getCurrentUser(state) || {},
    countries: APP_SELECTORS.getCountries(state),
    country: APP_SELECTORS.getSelectedCountry(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingList);
