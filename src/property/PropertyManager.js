/**
 * @flow
 */
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Alert, Image, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ACTIONS} from './common/actions';
import {SELECTORS} from './common/selectors';
import PropertyManagerScene from './scenes/PropertyManagerScene';
import I18n from './../app/common/locale';

class PropertyList extends PureComponent {
  static propTypes = {
    properties: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.actions.fetchMyProperties();
  }

  loadScene = (property: object) => {
    this.props.navigation.navigate('PropertyDetailScene', {
      property: property,
    });
  };

  fetchProperties = () => {
    this.props.actions.fetchMyProperties();
  };

  handleFavoritePress = (property: object) => {
    this.props.actions.favoriteProperty(property);
  };

  editProperty = item => {
    this.props.actions.editProperty(item);
    this.props.navigation.navigate('PropertyEditScene');
  };

  deleteProperty = item => {
    return Alert.alert(I18n.t('delete'), I18n.t('are_you_sure'), [
      {text: I18n.t('cancel')},
      {
        text: I18n.t('yes'),
        onPress: () => {
          this.props.actions.deleteProperty(item);
        },
      },
    ]);
  };

  render() {
    const {properties, isFetching} = this.props;
    let emptyIcon = require('./../../assets/empty.png');

    if (!isFetching && properties.length === 0) {
      return (
        <View
          style={[
            styles.container,
            {
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <Image
            source={emptyIcon}
            style={{width: 200, height: 200}}
            resizeMode="contain"
          />
        </View>
      );
    }

    return (
      <PropertyManagerScene
        collection={properties}
        loadScene={this.loadScene}
        handleFavoritePress={this.handleFavoritePress}
        isFetching={isFetching}
        fetchProperties={this.fetchProperties}
        editProperty={this.editProperty}
        deleteProperty={this.deleteProperty}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...ACTIONS}, dispatch)};
}

function mapStateToProps(state) {
  return {
    properties: SELECTORS.getMyProperties(state),
    isFetching: SELECTORS.isMyPropertiesFetching(state),
    mapView: SELECTORS.getMapView(state),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PropertyList);
