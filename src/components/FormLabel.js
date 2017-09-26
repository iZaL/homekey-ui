import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import I18n from './../app/common/locale';
import PropTypes from 'prop-types';
import colors from '../common/colors';

export default class FormLabel extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    // style:PropTypes.object
  };

  render() {
    const {title, style} = this.props;
    return (
      <Text {...this.props} style={[styles.label, style]}>
        {title}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'left',
    writingDirection: I18n.locale === 'ar' ? 'rtl' : 'ltr',
    fontSize: 15,
    color: colors.darkGrey,
    fontWeight: '500',
    textShadowColor: colors.fadedWhite,
    textShadowOffset: {width: 0.1, height: 0.1},
  },
});
