import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {ACTIONS} from './common/actions';
import Navigator from './../common/navigator';
import NavigationService from './../components/NavigationService';
import LanguageSelectScene from './../app/scenes/LanguageSelectScene';
import CodePush from 'react-native-code-push';
import {CODEPUSH_ENABLED} from './../env';
import PushNotificationManager from './components/PushNotificationManager';
import Notification from './components/Notification';

class App extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
  };

  navigator;

  componentDidMount() {
    if (CODEPUSH_ENABLED) {
      CodePush.sync();
    }
    this.props.dispatch(ACTIONS.boot());
    // this.props.dispatch(ACTIONS.setLanguage('en'));
  }

  onLanguageSelect = name => {
    this.props.dispatch(ACTIONS.setLanguage(name));
    this.props.dispatch(ACTIONS.setBootstrapped(true));
  };

  setPushToken = token => {
    this.props.dispatch(ACTIONS.setPushToken(token));
  };

  dismissNotification = () => {
    this.props.dispatch(ACTIONS.dismissNotification());
  };

  navigateToScene = (scene, params) => {
    this.props.dispatch(ACTIONS.navigateToScene(scene, params));
  };

  render() {
    const {app} = this.props;
    if (!app.booted) return null;

    if (!app.bootstrapped) {
      return (
        <LanguageSelectScene
          onLanguageSelect={this.onLanguageSelect}
          selectedLanguage=""
        />
      );
    }

    return (
      <View style={{flex: 1}}>
        {app.notifications.message && (
          <Notification
            message={app.notifications.message}
            messageType={app.notifications.messageType}
            dismissNotification={this.dismissNotification}
          />
        )}

        <PushNotificationManager
          setPushToken={this.setPushToken}
          navigateToScene={this.navigateToScene}
        />

        <Navigator
          ref={navigatorRef => {
            NavigationService.setContainer(navigatorRef);
          }}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    app: state.appReducer,
    navigation: state.navigation,
  };
}

export default connect(mapStateToProps)(App);
