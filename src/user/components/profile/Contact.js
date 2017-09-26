import PropTypes from 'prop-types';
/**
 @flow
 */
import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import colors from '../../../common/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Separator from './../../../components/Separator';
import I18n from './../../../app/common/locale';
import LocalizedText from '../../../components/LocalizedText';

const Contact = ({user}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>
          {I18n.t('name')}
        </Text>
        <View style={styles.content}>
          <LocalizedText
            en={user.name_en}
            ar={user.name_ar}
            style={styles.name}
          />
        </View>
      </View>
      <Separator style={{marginVertical: 20}} />

      {user.mobile &&
        <View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>
              {I18n.t('mobile')}
            </Text>
            <View style={styles.content}>
              <Ionicons
                name="md-phone-portrait"
                size={20}
                style={styles.icon}
              />
              <Text style={styles.name}>
                {user.mobile}
              </Text>
            </View>
          </View>
          <Separator style={{marginVertical: 20}} />
        </View>}

      {user.email &&
        <View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>
              {I18n.t('email')}
            </Text>
            <View style={styles.content}>
              <Ionicons name="ios-mail" size={22} style={styles.icon} />
              <Text style={styles.name}>
                {user.email}
              </Text>
            </View>
          </View>
          <Separator style={{marginVertical: 20}} />
        </View>}

      {user.company &&
        user.company.address &&
        <View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>
              {I18n.t('company_address')}
            </Text>
            <View style={styles.content}>
              <Ionicons name="ios-pin-outline" size={22} style={styles.icon} />
              <Text style={styles.name}>
                {user.company.address}
              </Text>
            </View>
          </View>
          <Separator style={{marginVertical: 20}} />
        </View>}

      {user.company &&
        user.company.description &&
        <View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>
              {I18n.t('company_description')}
            </Text>
            <View style={styles.content}>
              <Ionicons name="md-bulb" size={22} style={styles.icon} />
              <Text style={styles.name}>
                {user.company.description}
              </Text>
            </View>
          </View>
          <Separator style={{marginVertical: 20}} />
        </View>}
    </ScrollView>
  );
};

Contact.propTypes = {
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
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '100',
    color: colors.darkGrey,
    paddingHorizontal: 5,
  },
  label: {
    paddingBottom: 5,
    color: colors.mediumGrey,
    textAlign: 'left',
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default Contact;
