import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ACTIONS} from './common/actions';
import {ACTIONS as PROPERTY_ACTIONS} from '../property/common/actions';
import {SELECTORS} from './common/selectors';
import {SELECTORS as PROPERTY_SELECTORS} from '../property/common/selectors';
import {SELECTORS as APP_SELECTORS} from '../app/common/selectors';
import ProfileScene from './scenes/ProfileScene';

class Profile extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.fetchProperties();
  }

  handleFavoritePress = (item: object) => {
    this.props.actions.favoriteProperty(item);
  };

  loadPropertyScene = (item: object) => {
    const {navigation} = this.props;
    navigation.navigate('PropertyDetailScene', {
      property: item,
    });
  };

  fetchProperties = () => {
    this.props.actions.fetchUserProperties({
      userID: this.props.navigation.state.params.user._id,
    });
  };

  render() {
    const {properties, isFetching, country, countries, user} = this.props;

    return (
      <ProfileScene
        user={user}
        properties={properties}
        isFetching={isFetching}
        country={country}
        loadScene={this.loadPropertyScene}
        fetchProperties={this.fetchProperties}
        handleFavoritePress={this.handleFavoritePress}
        refreshProperties={() => {}}
        countries={countries}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...ACTIONS, ...PROPERTY_ACTIONS}, dispatch),
  };
}

function mapStateToProps(state, props) {
  return {
    user: SELECTORS.getUser(state, props),
    properties: PROPERTY_SELECTORS.getUserProperties(state, props),
    isFetching: SELECTORS.isUserPropertiesFetching(state),
    country: APP_SELECTORS.getSelectedCountry(state),
    countries: APP_SELECTORS.getCountries(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
