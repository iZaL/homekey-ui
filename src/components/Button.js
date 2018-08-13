import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Button as PaperButton} from 'react-native-paper';

export default class Button extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.disabled !== this.props.disabled ||
      nextProps.title !== this.props.title
    );
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    background: PropTypes.string,
  };

  static defaultProps = {
    background: 'primary',
    underlayColor: 'transparent',
  };

  render() {
    const {title, titleStyle, disabled, onPress, style, ...rest} = this.props;

    return (
      <PaperButton
        disabled={disabled}
        onPress={onPress}
        style={[styles.container, style]}
        {...rest}>
        <Text style={[styles.text,titleStyle]}>{title}</Text>
      </PaperButton>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  text:{
    textAlign:'left'
  }
});
