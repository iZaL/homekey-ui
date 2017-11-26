/**
 @flow
 */
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import colors from '../../common/colors';

const ChatHeader = ({property,onTitlePress}) => {
  return (
    <TouchableHighlight underlayColor="transparent" style={styles.container} onPress={()=>onTitlePress(property)}>
      <Text style={styles.header}>{property.meta.title}</Text>
    </TouchableHighlight>
  );
};

ChatHeader.propTypes = {
  property: PropTypes.object.isRequired,
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
