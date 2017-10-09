import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../../common/colors';

const Header = ({title}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
    backgroundColor: colors.lightGrey,
  },
  text: {
    color: 'black',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Header;
