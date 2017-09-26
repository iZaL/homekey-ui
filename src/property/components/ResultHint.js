import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CountryPropType} from './../common/proptypes';
import colors from './../../common/colors';
import I18n from './../../app/common/locale';

const ResultHint = props => {
  let {propertyType, searchLocation, country, isFetching} = props;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isFetching && I18n.t('fetching')} {I18n.t('properties')}{' '}
        {I18n.t([propertyType])} {I18n.t('in')}{' '}
        {searchLocation ? searchLocation : country.name}
      </Text>
    </View>
  );
};

ResultHint.propTypes = {
  country: CountryPropType.isRequired,
  propertyType: PropTypes.string,
  searchLocation: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    zIndex: 10000,
    padding: 10,
    backgroundColor: colors.fadedWhite,
  },
  title: {
    textAlign: 'center',
    color: colors.fadedBlack,
    fontSize: 13,
  },
});

export default ResultHint;
