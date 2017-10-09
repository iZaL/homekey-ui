/**
 @flow
 */
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../common/colors';

const ChatHeader = ({text}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{text}</Text>
    </View>
  );
};

ChatHeader.propTypes = {
  text: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
  },
  header: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.darkGrey,
  },
});

export default ChatHeader;
