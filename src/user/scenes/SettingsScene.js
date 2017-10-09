import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import SettingListItem from '../components/SettingListItem';
import EditProfile from '../components/profile/EditProfile';
import Separator from '../../components/Separator';
import {CountryPropType} from '../../property/common/proptypes';
import I18n from './../../app/common/locale';

export default class SettingsScene extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    // user: PropTypes.oneOfType([PropTypes.object, PropTypes.null]).isRequired,
    country: CountryPropType.isRequired,
    loadScene: PropTypes.func.isRequired,
  };

  render() {
    const {isAuthenticated, user, country, loadScene} = this.props;
    return (
      <ScrollView style={styles.container}>
        {isAuthenticated && <EditProfile loadScene={loadScene} user={user} />}

        <SettingListItem
          title={I18n.t('upload_property')}
          route="propertyCreate"
          loadScene={loadScene}
          icon="plus-square-o"
        />

        <Separator />

        <SettingListItem
          title={I18n.t('change_country')}
          route="countrySelect"
          loadScene={loadScene}
          icon="globe"
          selected={country.fullName}
        />

        <Separator />

        <SettingListItem
          title={I18n.t('change_language')}
          route="languageSelect"
          loadScene={loadScene}
          icon="universal-access"
        />
        <Separator />

        <SettingListItem
          title={I18n.t('chat')}
          route="chat"
          loadScene={loadScene}
          icon="wechat"
        />
        <Separator />

        {isAuthenticated ? (
          <View>
            <SettingListItem
              title={I18n.t('my_properties')}
              route="manageProperties"
              loadScene={loadScene}
              icon="building"
            />
            <Separator />
            <SettingListItem
              title={I18n.t('logout')}
              route="logout"
              loadScene={loadScene}
              icon="key"
            />
          </View>
        ) : (
          <SettingListItem
            title={I18n.t('login')}
            route="login"
            loadScene={loadScene}
            icon="key"
          />
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
