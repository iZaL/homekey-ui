/**
 * @flow
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ACTIONS} from './common/actions';
import {ACTIONS as APP_ACTIONS} from './../app/common/actions';
import {SELECTORS} from './common/selectors';
import {SELECTORS as APP_SELECTORS} from './../app/common/selectors';
import PropertyEditScene from './scenes/PropertyEditScene';
import I18n from './../app/common/locale';

class PropertyCreate extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  updateStore = payload => {
    return this.props.actions.changeListingValue(payload);
  };

  saveProperty = () => {
    this.props.actions.saveProperty(this.props.listing.attributes);
  };

  saveAddress = params => {
    this.props.actions.updateAddress(params);
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  uploadImages = () => {

    let {images} = this.props.listing.attributes;

    return new Promise((resolve, reject) => {
      this.props.actions.uploadImages({
          images,
          resolve,
          reject,
        })
    })
      .then(imgs => {
        const payload = {
          replace: true,
          clone: true,
          key: 'images',
          item: imgs,
        };
        this.updateStore(payload);
      })
      .catch(e => {
        console.log('e', e);
      });
  };

  render() {
    let {categories, listing, propertyType} = this.props;

    let currentCategories = listing.attributes.type
      ? categories[listing.attributes.type]
      : [];

    return (
      <PropertyEditScene
        {...this.props}
        categories={currentCategories}
        listing={listing}
        updateStore={this.updateStore}
        saveProperty={this.saveProperty}
        navBarTitle={I18n.t('add_property')}
        propertyType={propertyType}
        popBack={this.goBack}
        saveAddress={this.saveAddress}
        uploadImages={this.uploadImages}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...ACTIONS, ...APP_ACTIONS}, dispatch)};
}

function mapStateToProps(state) {
  return {
    listing: SELECTORS.getAddListing(state),
    categories: SELECTORS.getCategories(state),
    types: SELECTORS.getPropertyTypes(state),
    amenities: SELECTORS.getAmenities(state),
    nearByPlaces: SELECTORS.getNearByPlaces(state),
    country: APP_SELECTORS.getSelectedCountry(state),
    genders: SELECTORS.getGenders(state),
    saving: SELECTORS.getSaving(state),
    metas: SELECTORS.getAddMetas(state),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PropertyCreate);
