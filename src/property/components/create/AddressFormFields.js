import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from 'react-native';
import TextInput from './../../../components/TextInput';
import I18n from './../../../app/common/locale';

export default class AddressFormFields extends PureComponent {
  static propTypes = {
    block: PropTypes.string,
    street: PropTypes.string,
    description: PropTypes.string,
    building: PropTypes.string,
    updateFields: PropTypes.func.isRequired,
  };

  render() {
    const {
      block,
      street,
      avenue,
      building,
      updateFields,
      description,
    } = this.props;

    return (
      <View style={styles.addressContainer}>
        <View style={styles.addressField}>
          <TextInput
            onValueChange={updateFields}
            value={description}
            field="description"
            maxLength={40}
            autoFocus={false}
            style={styles.textInput}
            placeholder={I18n.t('description')}
          />
        </View>

        <View style={styles.addressField}>
          <TextInput
            onValueChange={updateFields}
            value={block}
            field="block"
            maxLength={40}
            autoFocus={false}
            style={styles.textInput}
            placeholder={I18n.t('block')}
          />
        </View>

        <View style={[styles.addressField]}>
          <TextInput
            onValueChange={updateFields}
            value={street}
            field="street"
            maxLength={40}
            autoFocus={false}
            style={styles.textInput}
            placeholder={I18n.t('street')}
          />
        </View>

        <View style={styles.addressField}>
          <TextInput
            onValueChange={updateFields}
            value={avenue}
            field="avenue"
            maxLength={40}
            autoFocus={false}
            style={styles.textInput}
            placeholder={I18n.t('avenue')}
          />
        </View>

        <View style={styles.addressField}>
          <TextInput
            onValueChange={updateFields}
            value={building}
            field="building"
            maxLength={40}
            autoFocus={false}
            style={styles.textInput}
            placeholder={I18n.t('building')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
  },
  addressContainer: {
    // flexDirection: 'row',
  },
  addressField: {
    paddingHorizontal: 5,
    marginHorizontal: 1,
  },
  textInput: {},
});
