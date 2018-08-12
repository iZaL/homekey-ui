import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import UserLogo from '../components/profile/UserLogo';
import Contact from '../components/profile/Contact';
import PropertyListScene from '../../property/scenes/PropertyListScene';
import {TabBar, TabView} from 'react-native-tab-view';
import colors from '../../common/colors';
import {CountryPropType} from '../../property/common/proptypes';
import I18n from './../../app/common/locale';

export default class ProfileScene extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    properties: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    loadScene: PropTypes.func.isRequired,
    handleFavoritePress: PropTypes.func.isRequired,
    fetchProperties: PropTypes.func.isRequired,
    country: CountryPropType.isRequired,
    countries: PropTypes.array.isRequired,
  };

  state = {
    index: 0,
    routes: [
      {key: '1', title: I18n.t('properties')},
      {key: '2', title: I18n.t('information')},
    ],
  };

  handleChangeTab = index => {
    this.setState({index});
  };

  renderHeader = props => {
    return (
      <TabBar
        {...props}
        scrollEnabled
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        labelStyle={styles.label}
      />
    );
  };

  renderScene = ({route}) => {
    const {
      user,
      properties,
      isFetching,
      loadScene,
      handleFavoritePress,
      fetchProperties,
      country,
      refreshProperties,
      countries,
    } = this.props;

    switch (route.key) {
      case '1':
        return (
          <PropertyListScene
            collection={properties}
            loadScene={loadScene}
            handleFavoritePress={handleFavoritePress}
            isFetching={isFetching}
            fetchProperties={fetchProperties}
            country={country}
            refreshProperties={refreshProperties}
            countries={countries}
          />
        );
      case '2':
        return <Contact user={user} />;
      default:
        return null;
    }
  };

  render() {
    const {user, isFetching} = this.props;
    return (
      <View style={{flex: 1}}>
        {user && user.image && <UserLogo user={user} />}
        <TabView
          style={styles.container}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderHeader}
          onIndexChange={this.handleChangeTab}
          {...this.props}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: 'white',
  },
  indicator: {
    height: 2,
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.darkGrey,
    fontWeight: '400',
  },
});
