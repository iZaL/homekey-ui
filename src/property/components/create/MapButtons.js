import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';
import Button from './../../../components/Button';
import I18n from './../../../app/common/locale';

export default class MapButtons extends Component {
  static propTypes = {
    save: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps, prevState) {
    return false;
  }

  render() {
    let {close, save, style} = this.props;

    return (
      <View style={[styles.container, style]}>
        <Button
          onPress={close}
          style={styles.button}
          raised
          title={I18n.t('cancel')}
        />
        <Button
          onPress={save}
          style={styles.button}
          raised
          primary
          dark
          title={I18n.t('save')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    borderRadius: 0,
  },
});
