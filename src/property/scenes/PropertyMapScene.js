import PropTypes from 'prop-types';
import React, {PureComponent, Component} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import colors from './../../common/colors';
import PropertyIcons from './../components/PropertyIcons';
import moment from 'moment';
import {CountryPropType} from './../common/proptypes';
import {numberWithCommas} from '../../common/functions';
import I18n from './../../app/common/locale';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 2.5;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class PropertyMapScene extends PureComponent {
  static propTypes = {
    onRegionChange: PropTypes.func,
    collection: PropTypes.array.isRequired,
    country: CountryPropType.isRequired,
    fetchProperties: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    let {latitude, longitude} = this.props.country.coords;

    this.state = {
      region: {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
  }

  // shouldComponentUpdate(nextProps) {
  //   return nextProps.collection !== this.props.collection;
  // }

  onRegionChange = region => {
    this.setState({region});
  };

  render() {
    const {collection, loadScene, fetchProperties, isFetching} = this.props;

    return (
      <View style={styles.container}>
        <MapView
          ref="map"
          style={styles.map}
          initialRegion={this.state.region}
          onRegionChangeComplete={this.onRegionChange}>
          {collection.map(property => {
            let {meta, address} = property;
            return (
              <MapView.Marker
                ref={'ref' + property._id}
                key={'key' + property._id}
                coordinate={{
                  latitude: parseFloat(address.latitude),
                  longitude: parseFloat(address.longitude),
                }}
                pinColor="red">
                <MapView.Callout>
                  <TouchableHighlight
                    style={styles.mapContainer}
                    onPress={() => loadScene(property)}
                    underlayColor="transparent">
                    <View style={styles.mapContent}>
                      <View style={styles.leftCol}>
                        <Image
                          source={{uri: property.images[0]}}
                          style={styles.image}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={styles.rightCol}>
                        <View>
                          <Text style={styles.title}>
                            {property.title}
                          </Text>
                        </View>
                        <Text style={styles.price}>
                          {numberWithCommas(property.meta.price)}{' '}
                          {property.country.currency}
                        </Text>
                        <PropertyIcons
                          services={meta || []}
                          items={['bedroom', 'bathroom', 'parking']}
                        />
                        <Text style={styles.lightText}>
                          {I18n.t('added')}{' '}
                          {moment(property.created_at).fromNow()}
                        </Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                </MapView.Callout>
              </MapView.Marker>
            );
          })}
        </MapView>

        <TouchableHighlight
          style={[styles.loadMoreButton, isFetching && {opacity: 0.5}]}
          underlayColor="transparent"
          onPress={() => fetchProperties()}
          disabled={isFetching}>
          <Text style={styles.loadMoreText}>
            {isFetching ? I18n.t('fetching') : I18n.t('load_more')}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'green',
    zIndex: 1000,
    alignItems: 'center',
  },
  getDirectionText: {
    textDecorationLine: 'underline',
    paddingTop: 20,
    fontSize: 9,
  },
  companyName: {
    fontSize: 9,
    padding: 5,
    color: colors.darkGrey,
    fontWeight: '400',
  },
  title: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'left',
  },
  image: {
    width: 100,
    height: 100,
  },
  mapContainer: {
    flex: 1,
    height: 100,
    alignItems: 'center',
    maxWidth: Dimensions.get('window').width,
  },
  mapContent: {
    flex: 1,
    flexDirection: 'row',
  },
  leftCol: {
    marginHorizontal: 2,
  },
  rightCol: {
    marginHorizontal: 2,
  },
  lightText: {
    color: colors.fadedBlack,
    fontWeight: '100',
    fontSize: 12,
    textAlign: 'left',
  },
  price: {
    color: colors.black,
    fontWeight: '500',
    fontSize: 16,
    paddingTop: 5,
    textAlign: 'left',
  },
  loadMoreButton: {
    position: 'absolute',
    bottom: 20,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 50,
  },
  loadMoreText: {
    color: colors.fadedWhite,
  },
});