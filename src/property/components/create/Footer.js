import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';
import colors from '../../../common/colors';
import I18n from './../../../app/common/locale';

const Footer = ({title, updateListing, disabled = false}) => {
  return (
    <TouchableHighlight
      underlayColor="transparent"
      onPress={() => updateListing()}
      style={[styles.container, disabled && {opacity: 0.5}]}
      disabled={disabled}>
      <Text style={styles.text}>{title ? title : I18n.t('next')}</Text>
    </TouchableHighlight>
  );
};

Footer.propTypes = {
  title: PropTypes.string,
  updateListing: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'transparent',
  },
  text: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
  },
});

export default Footer;
