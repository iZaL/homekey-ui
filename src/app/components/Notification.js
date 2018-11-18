import PropTypes from 'prop-types';
import React, {Component} from 'react';
import isEmpty from 'lodash/isEmpty';
import colors from './../../common/colors';
import {Snackbar} from 'react-native-paper';
import I18n, {isRTL} from '../common/locale';
import {Text} from 'react-native';

export default class Notification extends Component {
  static propTypes = PropTypes.shape({
    message: PropTypes.string.isRequired,
    messageType: PropTypes.string,
  }).isRequired;

  state = {
    visible: false,
  };

  static getDerivedStateFromProps(nextProps) {
    if (!isEmpty(nextProps.message)) {
      return {
        visible: true,
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.visible !== this.state.visible;
  }

  closeModal = () => {
    this.setState({
      visible: false,
    });
    this.props.dismissNotification();
  };

  render() {
    const {messageType, message} = this.props;

    const {visible} = this.state;

    return (
      <Snackbar
        visible={visible}
        onDismiss={() => this.closeModal()}
        duration={3500}
        primary
        raised
        style={{
          backgroundColor:
            messageType === 'error' ? colors.error : colors.success,
        }}
        action={{
          label: I18n.t('ok'),
          onPress: () => {
            this.closeModal();
          },
        }}>
        {message}
      </Snackbar>
    );
  }
}
