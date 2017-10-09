import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import colors from '../../../common/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import isNull from 'lodash/isNull';

const NavBack = ({style, text, icon, stage, onPress}) => {
  return (
    <View style={{flex: 1}}>
      {!isNull(stage) &&
        stage > 1 && (
          <TouchableHighlight
            style={styles.container}
            onPress={() => onPress()}
            underlayColor="transparent">
            {icon ? (
              <Ionicons
                name={icon}
                size={33}
                color={colors.primary}
                style={[styles.icon]}
              />
            ) : (
              <Text style={[styles.title, style]}>{text}</Text>
            )}
          </TouchableHighlight>
        )}
    </View>
  );
};

NavBack.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  stage: PropTypes.number,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 10,
  },
  title: {
    color: colors.primary,
    fontSize: 15,
  },
  icon: {
    width: 13,
    height: 33,
    alignSelf: 'center',
  },
});

export default NavBack;
