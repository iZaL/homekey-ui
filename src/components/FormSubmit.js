import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, TouchableHighlight} from 'react-native';
import I18n from './../app/common/locale';
import PropTypes from 'prop-types';
import colors from '../common/colors';
import {isRTL} from '../app/common/locale';

export default class FormSubmit extends Component {
  static propTypes = {
    // style:PropTypes.object,
    title: PropTypes.string.isRequired,
    // titleStyle:PropTypes.object
  };

  render() {
    const {style, title, titleStyle, disabled, ...rest} = this.props;
    return (
      <TouchableHighlight
        {...rest}
        underlayColor="transparent"
        disabled={disabled}
        style={[styles.button, style, disabled && {opacity: 0.4}]}>
        <Text style={[styles.buttonText, titleStyle]}>
          {title}
        </Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    padding: 10,
    height: 40,
    width: 200,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
});
