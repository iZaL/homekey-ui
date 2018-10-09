/**
 * @flow
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Dimensions, Image, StyleSheet,Platform} from 'react-native';
import MapView from 'react-native-maps';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class MapPicker extends Component {
  static propTypes = {
    updateAddress: PropTypes.func.isRequired,
    address: PropTypes.object.isRequired,
  };

  // shouldComponentUpdate(nextProps) {
  //   return nextProps.address.area_id !== this.props.address.area_id;
  // }

  componentDidUpdate(nextProps) {
    if (nextProps.address.area_id !== this.props.address.area_id) {
      this.map.animateToRegion(this.props.address);
    }
  }

  updateAddress = (address: object) => {
    this.props.updateAddress(address);
  };

  onRegionChangeComplete = region => {
    let {latitude, longitude} = region;
    let params = {
      latitude: latitude,
      longitude: longitude,
    };
    this.updateAddress(params);
  };

  render() {
    const {latitude, longitude} = this.props.address;

    const markerImage = require('./../../../../assets/pin.png');

    return (
      <MapView
        ref={ref => {
          this.map = ref;
        }}
        style={[styles.container]}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        onRegionChangeComplete={this.onRegionChangeComplete}
        showsUserLocation={true}
        pitchEnabled={false}
        rotateEnabled={false}
        tracksViewChanges={true}
      >
        <MapView.Marker
          coordinate={{
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          }}
          pinColor="red"
          image={Platform.OS === 'android' ? markerImage : undefined}
        >
          {Platform.OS === 'ios'
            ? <Image
              source={markerImage}
              style={styles.image}
              resizeMode="contain"
            />
            : null}
        </MapView.Marker>
        {/*<Image*/}
          {/*source={markerImage)}*/}
          {/*style={styles.image}*/}
          {/*resizeMode="contain"*/}
        {/*/>*/}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    zIndex:1000
  },
});
