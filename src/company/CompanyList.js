/**
 * @flow
 */
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ACTIONS} from './common/actions';
import {ACTIONS as USER_ACTIONS } from './../user/common/actions';
import {SELECTORS} from './common/selectors';
import {SELECTORS as APP_SELECTORS} from './../app/common/selectors';
import CompanyListScene from './scenes/CompanyListScene';

class CompanyList extends PureComponent {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.fetchCompanies();
  }

  loadScene = (user: object) => {
    this.props.actions.resetUserProperties();
    this.props.navigation.navigate('ProfileScene', {
      user: user,
    });
  };

  fetchCompanies = () => {
    this.props.actions.fetchDomesticCompanies();
  };

  handleFavoritePress = (property: object) => {
    this.props.actions.favoriteProperty(property);
  };

  refreshCompanies = () => {
    this.props.actions.resetDomesticCompaniesNextPageURL();
    this.props.actions.fetchDomesticCompanies();
  };

  render() {
    const {companies, isFetching, country} = this.props;

    console.log('c',companies);
    return (
      <CompanyListScene
        collection={companies}
        loadScene={this.loadScene}
        isFetching={isFetching}
        fetchCollection={this.fetchCompanies}
        country={country}
        refreshCollection={this.refreshCompanies}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...ACTIONS,...USER_ACTIONS}, dispatch)};
}

function mapStateToProps(state) {
  return {
    companies: SELECTORS.getDomesticCompanies(state),
    isFetching: SELECTORS.getIsDomesticFetching(state),
    country: APP_SELECTORS.getSelectedCountry(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyList);
