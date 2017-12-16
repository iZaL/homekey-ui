/**
 * @flow
 */
import React, {Component} from 'react';
import {Animated, Easing, Text} from 'react-native';
import List from './../components/create/List';
import AddressPicker from './../components/create/AddressPicker';
import PropertyMeta from './../components/create/PropertyMeta';
import UploadImage from './../components/create/UploadImage';
import PropertyInfo from './../components/create/PropertyInfo';
import PropertyAmenities from './../components/create/PropertyAmenities';
import NavBar from './../../components/NavBar';
import NavButton from './../../components/NavButton';
import Header from './../components/create/Header';
import Footer from './../components/create/Footer';
import {CountryPropType} from './../common/proptypes';
import I18n, {isRTL} from '../../app/common/locale';
import PropTypes from 'prop-types';

export default class PropertyEditScene extends Component {
  static propTypes = {
    listing: PropTypes.object.isRequired,
    types: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    amenities: PropTypes.array.isRequired,
    country: CountryPropType.isRequired,
    genders: PropTypes.array.isRequired,
    saving: PropTypes.bool.isRequired,
    updateStore: PropTypes.func.isRequired,
    saveProperty: PropTypes.func.isRequired,
    navBarTitle: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.fadeAnim = new Animated.Value(1);
  }

  animate = () => {
    this.fadeAnim = new Animated.Value(0.5);

    Animated.timing(this.fadeAnim, {
      toValue: 1, // Target
      duration: 2000, // Configuration
      easing: Easing.bounce,
    }).start();
  };

  updateMeta = (field, value) => {
    let payload = {
      [field]: value.key,
    };

    console.log('payload',payload);

    this.updateAttributes('meta', payload);
  };

  updateInfo = (field, value) => {
    let payload = {
      [field]: value,
    };
    this.updateAttributes('meta', payload);
  };

  updateAddress = data => {
    console.log('updating',data);

    // const {
    //   state_en,
    //   city_en,
    //   state_ar,
    //   city_ar,
    //   country,
    //   latitude,
    //   longitude,
    //   address_en,
    //   address_ar,
    // } = data;
    // const payload = {
    //   state_en,
    //   country,
    //   city_en,
    //   state_ar,
    //   city_ar,
    //   latitude,
    //   longitude,
    //   address_en,
    //   address_ar,
    // };

    this.updateAttributes('address', data);
  };

  updateImage = images => {
    const payload = {
      replace: true,
      key: 'images',
      item: images,
    };
    this.updateStore(payload);
  };

  updateAmenities = amenity => {
    const payload = {
      replace: true,
      key: 'amenities',
      item: amenity,
    };
    this.updateStore(payload);
  };

  updateNearByPlaces = place => {
    const payload = {
      replace: true,
      key: 'nearByPlaces',
      item: place,
    };
    this.updateStore(payload);
  };

  updateInfoScene = () => {
    let hasError = false;
    let {meta} = this.props.listing.attributes;

    let requiredFields = ['price', 'description', 'mobile'];

    requiredFields.map(item => {
      if (!meta[item]) {
        hasError = true;
        return this.props.actions.setNotification(
          `${I18n.t(item)} ${I18n.t('required')}`,
          'error',
        );
      }
    });

    if (!hasError) {
      this.goToNextStage();
    }
  };

  onListItemSelect = (field, value) => {
    this.updateAttributes(field, value);
    this.goToNextStage();
  };

  goToPrevStage = () => {
    this.animate();
    const {stage} = this.props.listing;
    const payload = {stage: stage - 1};
    this.updateStore(payload);
  };

  goToNextStage = () => {
    this.animate();
    const {stage} = this.props.listing;
    const payload = {stage: stage + 1};
    this.updateStore(payload);
  };

  updateAttributes = (index, value) => {
    const payload = {
      attributes: {
        [index]: value,
      },
    };
    this.updateStore(payload);
  };

  updateStore = payload => {
    this.props.updateStore(payload);
  };

  saveProperty = () => {
    this.props.saveProperty();
  };

  updateCategory = (field, value) => {
    let {categories} = this.props;
    let selectedCategory = categories.find(category => category.key === value);

    if (selectedCategory && !selectedCategory.showMetas) {
      this.updateAttributes('meta', {bedroom: '0'});
      this.updateAttributes('meta', {bathroom: '0'});
      this.updateAttributes('meta', {parking: '0'});
    }

    this.onListItemSelect(field, value);
  };

  render() {
    let {
      listing,
      types,
      categories,
      amenities,
      nearByPlaces,
      country,
      genders,
      saving,
      popBack,
      navBarTitle,
      metas,
    } = this.props;

    let {attributes, stage} = listing;

    let containerOpacity = this.fadeAnim;

    let navigateBack = (
      <NavButton
        icon={isRTL ? 'ios-arrow-forward' : 'ios-arrow-back'}
        iconSize={33}
        onPress={() => popBack()}
        style={{height: 33, width: 30, marginLeft: -5}}
      />
    );

    return (
      <Animated.View style={{flex: 1, opacity: containerOpacity}}>
        <NavBar
          middle={
            <Text style={{fontWeight: '500', fontSize: 17}}>{navBarTitle}</Text>
          }
          left={
            stage > 1 ? (
              <NavButton
                icon={isRTL ? 'ios-arrow-forward' : 'ios-arrow-back'}
                iconSize={33}
                onPress={() => this.goToPrevStage()}
                style={{height: 33, width: 30, marginLeft: -5}}
              />
            ) : (
              navigateBack
            )
          }
        />

        {stage === 6 && (
          <List
            field="type"
            collection={types}
            header={
              <Header
                title={I18n.t('what_type_of_property_you_want_to_list')}
              />
            }
            updateListing={this.onListItemSelect}
            selected={attributes.type}
          />
        )}

        {stage === 2 && (
          <List
            field="category"
            header={<Header title={I18n.t('select_category_type')} />}
            collection={categories}
            updateListing={this.updateCategory}
            selected={attributes.category}
          />
        )}

        {stage === 3 && (
          <AddressPicker
            country={country}
            address={attributes.address}
            header={
              <Header
                title={
                  isRTL
                    ? I18n.t('select_location')
                    : `${I18n.t('where_is_your')} ${I18n.t(
                        attributes.category,
                      )} ${I18n.t('located')} ?`
                }
              />
            }
            updateAddress={this.updateAddress}
            updateListing={this.goToNextStage}
          />
        )}

        {stage === 4 && (
          <PropertyMeta
            meta={attributes.meta}
            filters={metas}
            updateMeta={this.updateMeta}
            selectedCategory={
              attributes.category
                ? categories.find(
                    category => category.key === attributes.category,
                  )
                : {}
            }
            header={
              <Header
                title={`${I18n.t('just_little_bit_more_about')}${I18n.t(
                  attributes.category,
                )} `}
              />
            }
            footer={<Footer updateListing={this.goToNextStage} />}
          />
        )}

        {stage === 5 && (
          <UploadImage
            images={attributes.images}
            updateImage={this.updateImage}
            header={
              <Header title={` ${I18n.t('upload')} ${I18n.t('images')}  `} />
            }
            footer={<Footer updateListing={this.goToNextStage} />}
          />
        )}

        {stage === 1 && (
          <PropertyInfo
            attributes={attributes}
            genders={genders}
            onFieldChange={this.updateInfo}
            header={<Header title={I18n.t('you_are_almost_there')} />}
            footer={<Footer updateListing={this.updateInfoScene} />}
            country={country}
          />
        )}

        {stage === 7 && (
          <PropertyAmenities
            collection={nearByPlaces}
            selected={attributes.nearByPlaces ? attributes.nearByPlaces : []}
            updateListing={this.updateNearByPlaces}
            header={<Header title={I18n.t('near_by_places')} />}
            footer={<Footer updateListing={this.goToNextStage} />}
          />
        )}

        {stage === 8 && (
          <PropertyAmenities
            collection={amenities}
            selected={attributes.amenities ? attributes.amenities : []}
            updateListing={this.updateAmenities}
            header={<Header title={I18n.t('select_amenities')} />}
            footer={
              <Footer
                updateListing={this.saveProperty}
                title={saving ? I18n.t('saving') : I18n.t('save')}
                disabled={saving}
              />
            }
          />
        )}
      </Animated.View>
    );
  }
}
