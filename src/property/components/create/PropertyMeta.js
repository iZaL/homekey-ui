/**
 * @flow
 */
import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';
import colors from '../../../common/colors';
import Button from '../filters/Button';
import Separator from './../../../components/Separator';
import I18n from './../../../app/common/locale';

const PropertyMeta = ({
  header,
  footer,
  updateMeta,
  filters,
  meta,
  selectedCategory,
}) => {
  const {bedroom, bathroom, parking} = meta;
  const {bedroomsArr, bathroomsArr, parkingArr} = filters;

  return (
    <View style={[styles.container]}>
      {header}

      <View
        style={[
          styles.menuContainer,
          selectedCategory && !selectedCategory.showMetas
            ? styles.hiddenView
            : '',
        ]}
        pointerEvents={
          selectedCategory && !selectedCategory.showMetas ? 'none' : 'auto'
        }>
        <Button
          title={I18n.t('bedroom')}
          icon="bed"
          onPress={value => updateMeta('bedroom', value)}
          range={bedroomsArr}
          selected={bedroom.toString()}
        />

        <Separator style={[styles.separator, {marginVertical: 5}]} />

        <Button
          title={I18n.t('bathroom')}
          icon="bath"
          onPress={value => updateMeta('bathroom', value)}
          range={bathroomsArr}
          selected={bathroom.toString()}
        />

        <View style={[styles.separator, {marginVertical: 5}]} />
        <Button
          title={I18n.t('parking')}
          icon="car"
          onPress={value => updateMeta('parking', value)}
          range={parkingArr}
          selected={parking.toString()}
        />
      </View>

      {footer}
    </View>
  );
};

PropertyMeta.propTypes = {
  updateMeta: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  selectedCategory: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
    paddingBottom: 56,
  },
  menuContainer: {
    flex: 2,
    backgroundColor: 'white',
  },
  separator: {
    backgroundColor: colors.lightGrey,
    height: 0.5,
  },
  hiddenView: {
    opacity: 0.2,
  },
});

export default PropertyMeta;
