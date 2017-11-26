/**
 @flow
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import colors from '../../common/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Separator from '../../components/Separator';
import I18n, {isRTL} from '../../app/common/locale';

export default class UserEditScene extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    pickImage: PropTypes.func.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    name_en: PropTypes.string,
    name_ar: PropTypes.string,
    mobile: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    address: PropTypes.string,
    uploaded: PropTypes.bool.isRequired,
  };

  render() {
    const {
      user,
      uploaded,
      pickImage,
      onFieldChange,
      name_en,
      name_ar,
      mobile,
      image,
      description,
      address,
    } = this.props;

    return (
      <ScrollView style={styles.container}>
        {uploaded ? (
          <Image source={{uri: image}} style={styles.logo} />
        ) : user.image ? (
          <Image
            source={{uri: user.image}}
            style={styles.logo}
            resizeMode="cover"
          />
        ) : (
          <FontAwesome
            name="picture-o"
            color="white"
            size={200}
            style={styles.emptyImageIcon}
          />
        )}

        <View style={styles.editIconWrapper}>
          <TouchableHighlight onPress={pickImage} underlayColor="transparent" hitSlop={{top:20,right:20,bottom:20,left:20}}>
            <FontAwesome
              name="camera"
              color={colors.darkGrey}
              size={18}
              style={styles.editIcon}
            />
          </TouchableHighlight>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>
            {user.isCompany ? I18n.t('company_name_en') : I18n.t('name_en')}
          </Text>
          <TextInput
            style={styles.textInput}
            defaultValue={user.name_en}
            onChangeText={text => onFieldChange('name_en', text)}
            placeholder={I18n.t('name_en')}
            placeholderTextColor={colors.lightGrey}
          />
          <Separator style={{marginVertical: 20}} />

          <Text style={styles.label}>
            {user.isCompany ? I18n.t('company_name_ar') : I18n.t('name_ar')}
          </Text>
          <TextInput
            style={styles.textInput}
            defaultValue={user.name_ar}
            onChangeText={text => onFieldChange('name_ar', text)}
            placeholder={I18n.t('name_ar')}
            placeholderTextColor={colors.lightGrey}
          />
          <Separator style={{marginVertical: 20}} />

          <Text style={styles.label}>{I18n.t('mobile')}</Text>
          <TextInput
            style={styles.textInput}
            defaultValue={user.mobile}
            onChangeText={text => onFieldChange('mobile', text)}
            placeholder={I18n.t('mobile')}
            placeholderTextColor={colors.lightGrey}
          />
          <Separator style={{marginVertical: 20}} />

          {user.isCompany && (
            <View style={{flex: 1}}>
              <Text style={styles.label}>{I18n.t('company_description')}</Text>
              <TextInput
                style={styles.textInput}
                defaultValue={user.company.description}
                onChangeText={text => onFieldChange('description', text)}
                multiline={true}
                placeholder={I18n.t('company_description')}
                placeholderTextColor={colors.lightGrey}
              />
              <Separator style={{marginVertical: 20}} />

              <Text style={styles.label}>{I18n.t('company_address')}</Text>
              <TextInput
                style={styles.textInput}
                defaultValue={user.company.address}
                onChangeText={text => onFieldChange('address', text)}
                placeholder={I18n.t('company_address')}
                placeholderTextColor={colors.lightGrey}
                multiline={true}
              />

              <Separator style={{marginVertical: 20}} />
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
    paddingTop: 50,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGrey,
  },
  label: {
    fontSize: 15,
    fontWeight: '100',
    color: colors.darkGrey,
    textAlign: 'left',
  },
  logo: {
    height: 200,
    width: Dimensions.get('window').width,
    backgroundColor: colors.fadedWhite,
  },
  emptyImageIcon: {
    height: 200,
    backgroundColor: colors.lightGrey,
    textAlign: 'center',
  },
  editIconWrapper: {
    position: 'absolute',
    top: 200,
    right: 15,
    marginTop: -20,
    height: 40,
    width: 40,
    borderRadius: 20,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.darkGrey,
    shadowOpacity: 0.6,
    shadowOffset: {width: 1, height: 1},
  },
  textInput: {
    height: 40,
    fontSize: 16,
    marginVertical: 5,
    textAlign: isRTL ? 'right' : 'left',
  },
});
