/**
 @flow
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import colors from '../../../common/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const UserLogo = ({user}) => {
  return (
    <View style={styles.container}>
      {user.image
        ? <Image
            source={{uri: user.image}}
            style={styles.logo}
            resizeMode="cover"
          />
        : <FontAwesome
            name="picture-o"
            color="white"
            size={200}
            style={styles.emptyImageIcon}
          />}
      <Text style={styles.username}>
        {user.name}
      </Text>
    </View>
  );
};

UserLogo.propTypes = {
  user: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: colors.fadedWhite,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGrey,
    paddingTop: 5,
  },
  logo: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
});

export default UserLogo;
