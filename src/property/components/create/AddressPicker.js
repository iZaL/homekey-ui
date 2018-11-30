/**
 * @flow
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../../common/colors';
import Footer from './Footer';
import MapView from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_MAPS_KEY} from './../../../env.js';
import isEmpty from 'lodash/isEmpty';
import {CountryPropType} from './../../common/proptypes';
import I18n, {isRTL} from '../../../app/common/locale';
import Qs from 'qs';
import MapPicker from './MapPicker';
import Modal from 'react-native-modal';
import CreateAddressFields from './CreateAddressFields';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class AddressPicker extends Component {
  static propTypes = {
    country: CountryPropType.isRequired,
    updateAddress: PropTypes.func.isRequired,
    updateListing: PropTypes.func.isRequired,
    address: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    let {latitude, longitude} = this.props.address;

    this.state = {
      latitude: latitude,
      longitude: longitude,
      addressCreateFieldsModalVisible: false,
    };
  }

  // componentDidMount() {
  //   if(!this.state.latitude) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         this.setState({
  //           latitude: position.coords.latitude,
  //           longitude: position.coords.longitude,
  //           error: null,
  //         });
  //       },
  //       (error) => this.setState({ error: error.message }),
  //       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
  //     );
  //   }
  // }

  // async geoCode(locationData, lang) {
  //
  //   const {updateAddress} = this.props;
  //   let isEstablishment = false;
  //   if (locationData.terms[3]) {
  //     isEstablishment = true;
  //   }
  //
  //   let urlParams = Qs.stringify({
  //     key: GOOGLE_MAPS_KEY,
  //     placeid: locationData.place_id,
  //     language: lang,
  //   });
  //   let params;
  //   let city = `city_${lang}`;
  //   let state = `state_${lang}`;
  //   let address = `address_${lang}`;
  //   try {
  //     let request = await fetch(
  //       `https://maps.googleapis.com/maps/api/place/details/json?${urlParams}`,
  //     );
  //     let response = await request.json();
  //     console.log('response',response);
  //
  //     let {address_components, formatted_address} = response.result;
  //     // console.log('address_components',address_components);
  //
  //     params = {
  //       [address]: formatted_address,
  //       [city]: isEstablishment
  //         ? address_components[1].long_name
  //         : address_components[0].long_name,
  //       [state]: isEstablishment
  //         ? address_components[2].long_name
  //         : address_components[1].long_name,
  //     };
  //     // console.log('params',params);
  //
  //     updateAddress(params);
  //   } catch (e) {}
  // }

  updateListing = () => {
    const {address, updateListing, updateAddress, saveAddress} = this.props;
    console.log('this.state.latitude', this.state.latitude);
    console.log('this.props.address.latitude', this.props.address.latitude);

    if (this.state.latitude !== address.latitude || !address.city_en) {
      return Alert.alert(
        `${I18n.t('confirm_location')}`,
        `${I18n.t('confirm_location_confirmation')}`,
        [
          {text: I18n.t('cancel')},
          {
            text: I18n.t('yes'),
            onPress: () => {
              new Promise((resolve, reject) => {
                saveAddress({
                  resolve,
                  reject,
                  address,
                });
              })
                .then(data => {
                  updateAddress({
                    ...address,
                    ...data,
                  });

                  this.setState({
                    addressCreateFieldsModalVisible: true,
                  });
                })
                .catch(e => {});
            },
          },
        ],
      );
    } else {
      return updateListing();
    }
  };

  updateAddressFields = (address: object) => {
    this.props.updateAddress(address);
  };

  updateAddressModalFields = (address: object) => {
    this.props.updateAddress(address);
    this.hideAddressCreateFieldsModal();
    return this.props.updateListing();
  };

  hideAddressCreateFieldsModal = () => {
    this.setState({
      addressCreateFieldsModalVisible: false,
    });
  };

  render() {
    const {header, address} = this.props;

    return (
      <View style={styles.container}>


        {
          Platform.OS === "android" &&
          <View style={styles.marker}>
            <Image
              source={require('./../../../../assets/pin.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        }

        <MapPicker updateAddress={this.updateAddressFields} address={address} />

        <Footer updateListing={this.updateListing} />

        <Modal
          animationType="slide"
          isVisible={this.state.addressCreateFieldsModalVisible}
          style={{margin: 0, padding: 0, backgroundColor: 'white'}}
          presentationStyle="fullScreen"
          transparent={false}
          useNativeDriver={true}>
          <CreateAddressFields
            onCancel={this.hideAddressCreateFieldsModal}
            onSave={this.updateAddressModalFields}
            address={{...address}}
          />
        </Modal>
      </View>
    );
  }
}

const autoCompleteStyle = {
  textInputContainer: {
    margin: 0,
    backgroundColor: 'white',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    zIndex: 70000,
  },
  textInput: {
    color: colors.darkGrey,
    fontSize: 16,
    fontWeight: '400',
    textAlign: isRTL ? 'right' : 'left',
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  description: {
    textAlign: 'left',
  },
  row: {
    backgroundColor: 'white',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  menuContainer: {
    flex: 5,
    padding: 10,
    backgroundColor: 'white',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  searchInputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    zIndex: 5000,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  textInput: {
    backgroundColor: 'white',
  },
  textInputWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
});
