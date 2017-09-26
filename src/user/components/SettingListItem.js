/**
 @flow
 */
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import colors from '../../common/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SettingListItem = ({title, icon, route, loadScene}) => {
  return (
    <TouchableHighlight
      onPress={() => loadScene(route)}
      underlayColor="transparent"
      style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={{flex: 9}}>
          <Text style={styles.title}>
            {title}
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <FontAwesome
            style={styles.icon}
            name={icon}
            color={colors.fadedBlack}
            size={20}
          />
        </View>
      </View>
    </TouchableHighlight>
  );
};

SettingListItem.propTypes = {
  title: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  loadScene: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    color: 'black',
    textAlign: 'left',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  icon: {
    fontWeight: '100',
  },
});

export default SettingListItem;
