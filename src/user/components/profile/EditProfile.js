/*
 @flow
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import colors from '../../../common/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import I18n from './../../../app/common/locale';

const EditProfile = ({loadScene, user}) => {
  return (
    <TouchableHighlight
      onPress={() => loadScene('user')}
      underlayColor="transparent">
      <View style={styles.container}>
        <View style={styles.leftCol}>
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.hint}>{I18n.t('edit_profile')}</Text>
        </View>

        <View style={styles.rightCol}>
          {user.image ? (
            <Image
              source={{uri: user.image}}
              style={styles.logo}
              resizeMode="cover"
            />
          ) : (
            <FontAwesome
              name="user-circle-o"
              color={colors.darkGrey}
              size={80}
            />
          )}
        </View>
      </View>
    </TouchableHighlight>
  );
};

EditProfile.propTypes = {
  loadScene: PropTypes.func.isRequired,
  // user: PropTypes.oneOfType([PropTypes.object, PropTypes.null]).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.fadedWhite,
    paddingVertical: 10,
  },
  leftCol: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 20,
    color: colors.black,
    fontWeight: '700',
    paddingVertical: 5,
  },
  hint: {
    color: colors.darkGrey,
    fontWeight: '700',
    paddingBottom: 5,
  },
  icon: {
    fontWeight: '100',
  },
  logo: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: colors.lightGrey,
  },
});

export default EditProfile;
