import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {AppState} from 'react-native';
import PushNotification from 'react-native-push-notification';

export default class PushNotificationManager extends Component {
  static propTypes = {
    setPushToken: PropTypes.func.isRequired,
    navigateToScene: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    let {navigateToScene} = this.props;

    // PushNotification.localNotificationSchedule({
    //   message: "My Notification Message", // (required)
    //   date: new Date(Date.now() + (4000)), // in 60 secs
    //   userInfo:{
    //     type:'message.created',
    //     thread_id:'599632ca721fe379f6620c53',
    //     title:'ss title'
    //   }
    // });

    PushNotification.configure({
      onRegister: token => {
        this.props.setPushToken(token);
      },
      onNotification: function(notification) {
        if (
          notification.data.type &&
          notification.data.type === 'message.created'
        ) {
          if (AppState.currentState === 'background') {
            navigateToScene('ChatListScene', {});
            navigateToScene('ChatThreadScene', {
              thread_id: notification.data.thread_id,
              title: '',
            });
          }
        }
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  render() {
    return null;
  }
}
