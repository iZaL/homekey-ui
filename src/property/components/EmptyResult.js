import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CountryPropType} from './../common/proptypes';
import colors from './../../common/colors';
import I18n from './../../app/common/locale';

const EmptyResult = props => {
  let {propertyType, searchLocation, country, hasRelatedProperties} = props;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {I18n.t('no_properties_found_for')} {I18n.t([propertyType])}{' '}
        {I18n.t('in')} {searchLocation ? searchLocation : country.name}{' '}
        {/*{I18n.t('matching_your_criteria')}*/}
        {hasRelatedProperties && (
          <Text style={styles.relatedText}>
            {'\n'}
            {I18n.t('showing_related_properties')}
          </Text>
        )}
      </Text>
    </View>
  );
};

EmptyResult.propTypes = {
  country: CountryPropType.isRequired,
  propertyType: PropTypes.string,
  searchLocation: PropTypes.string,
  hasRelatedProperties: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.fadedWhite,
  },
  title: {
    textAlign: 'center',
    color: colors.fadedBlack,
    fontSize: 13,
  },
  relatedText: {
    paddingHorizontal: 10,
    textAlign: 'center',
    color: colors.primary,
    fontSize: 13,
    zIndex: 100000,
  },
});

export default EmptyResult;
