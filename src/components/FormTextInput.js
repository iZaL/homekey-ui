import React, {Component} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import colors from '../common/colors';
import {isRTL} from '../app/common/locale';

export default class FormTextInput extends Component {
  static propTypes = {
    // style:PropTypes.object
  };

  render() {
    const {style, ...rest} = this.props;
    return (
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.mediumGrey}
        autoCorrect={false}
        autoCapitalize="none"
        {...rest}
      />
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 0.5,
    fontSize: 15,
    color: 'black',
    fontWeight: '500',
    textAlign: isRTL ? 'right' : 'left',
    marginBottom: 10,
  },
});
