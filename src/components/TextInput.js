import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {TextInput as NativeTextInput} from 'react-native-paper';
import PropTypes from 'prop-types';
import colors from './../../src/common/colors';

export default class FormTextInput extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.value !== this.props.value ||
      nextProps.disabled !== this.props.disabled
    );
  }

  static propTypes = {
    field: PropTypes.string.isRequired,
    onValueChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
  };

  onValueChange = value => {
    let {field, onValueChange} = this.props;
    onValueChange(field, value);
  };

  render() {
    const {style, label, placeholder, ...rest} = this.props;
    return (
      <NativeTextInput
        onChangeText={this.onValueChange}
        label={label}
        placeholder={placeholder ? placeholder : label}
        style={[styles.input, style]}
        placeholderTextColor={colors.mediumGrey}
        autoCorrect={false}
        autoCapitalize="none"
        underlineColor={colors.primary}
        {...rest}
      />
    );
  }
}

const styles = StyleSheet.create({
  input: {
  },
});
