/**
 @flow
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import colors from '../../../common/colors';
import Separator from './../../../components/Separator';
import LocalizedText from '../../../components/LocalizedText';
import I18n from './../../../app/common/locale';
const UserInfo = ({user}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>
          {I18n.t('name')}
        </Text>

        <LocalizedText
          en={user.name_en}
          ar={user.name_ar}
          style={styles.name}
        />

        <Separator style={{marginVertical: 20}} />
      </View>
    </ScrollView>
  );
};

UserInfo.propTypes = {
  user: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    paddingTop: 20,
  },
  description: {
    fontWeight: '100',
    color: colors.darkGrey,
    fontSize: 15,
    textAlign: 'left',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'left',
  },
  label: {
    paddingBottom: 5,
    color: colors.darkGrey,
    textAlign: 'left',
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default UserInfo;
