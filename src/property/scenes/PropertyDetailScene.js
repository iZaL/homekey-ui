/**
 @flow
 */
import React, {Component} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import PropertyIcons from '../components/PropertyIcons';
import Favorite from '../components/Favorite';
import colors from '../../common/colors';
import PropertyMap from '../components/PropertyMap';
import Gallery from '../components/Gallery';
import YoutubePlayer from './../../components/YoutubePlayer';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Separator from './../../components/Separator';
import {CountryPropType} from './../common/proptypes';
import I18n from './../../app/common/locale';
import {numberWithCommas} from './../../common/functions';
import PropTypes from 'prop-types';
import {isRTL} from './../../app/common/locale';
import LocalizedText from './../../components/LocalizedText';

export default class PropertyDetailScene extends Component {
  static propTypes = {
    property: PropTypes.object.isRequired,
    handleFavoritePress: PropTypes.func.isRequired,
    loadProfile: PropTypes.func.isRequired,
    onPinPress: PropTypes.func.isRequired,
    sceneType: PropTypes.string.isRequired,
    setSceneType: PropTypes.func.isRequired,
    country: CountryPropType.isRequired,
    currentUserID: PropTypes.string.isRequired,
    countries: PropTypes.array.isRequired,
  };

  state = {
    scrollY: new Animated.Value(0),
    initialized: false,
  };

  componentDidMount() {
    setTimeout(
      () =>
        this.setState({
          initialized: true,
        }),
      1000,
    );
  }

  renderImage = () => {
    let {property} = this.props;
    let {scrollY} = this.state;

    let logoScale = scrollY.interpolate({
      inputRange: [-50, 0, 100],
      outputRange: [1.5, 1, 1],
    });

    let logoTranslateY = scrollY.interpolate({
      inputRange: [-150, 0, 150],
      outputRange: [40, 0, -40],
    });

    return (
      <View style={styles.hero}>
        <Animated.Image
          source={{uri: property.images[0]}}
          style={[
            styles.image,
            {
              transform: [{scale: logoScale}, {translateY: logoTranslateY}],
            },
          ]}
        />
      </View>
    );
  };

  makePhoneCall = number => {
    let url = `tel:${number}`;
    return Alert.alert(`${I18n.t('call')} ${' '} ${number} ?`, '', [
      {text: I18n.t('cancel')},
      {
        text: I18n.t('yes'),
        onPress: () => {
          return Linking.canOpenURL(url)
            .then(supported => {
              if (supported) {
                return Linking.openURL(url);
              }
            })
            .catch(err => console.error('could not send call', err));
        },
      },
    ]);
  };

  sendEmail = email => {
    let url = `mailto:${email}`;
    return Alert.alert(`${I18n.t('email')} ${' '} ${email} ?`, '', [
      {text: I18n.t('cancel')},
      {
        text: I18n.t('yes'),
        onPress: () => {
          Linking.canOpenURL(url)
            .then(supported => {
              if (supported) {
                return Linking.openURL(url);
              }
            })
            .catch(err => console.error('could not send email', err));
        },
      },
    ]);
  };

  render() {
    let {
      property,
      handleFavoritePress,
      loadProfile,
      onPinPress,
      sceneType,
      setSceneType,
      initiateChat,
      currentUserID,
      countries,
    } = this.props;

    let {address} = property;

    let {block,street,building,description} = address;

    let {scrollY} = this.state;

    switch (sceneType) {
      case 'mapScene': {
        return (
          <PropertyMap
            address={property.address}
            onPinPress={onPinPress}
            setSceneType={setSceneType}
            sceneType={sceneType}
          />
        );
      }

      case 'galleryScene': {
        return (
          <Gallery
            images={property.images}
            setSceneType={setSceneType}
            sceneType={sceneType}
          />
        );
      }

      default: {
        return (
          <View style={styles.container}>
            {this.renderImage()}

            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              style={[StyleSheet.absoluteFill]}
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: scrollY}}}],
                {
                  useNativeDriver: true,
                },
              )}>
              <TouchableHighlight
                onPress={() => setSceneType('galleryScene')}
                underlayColor="transparent">
                <View style={styles.heroSpacer} />
              </TouchableHighlight>

              <View style={styles.contentContainerStyle}>
                {/*  Chat */}

                {property.user._id != currentUserID && (
                  <View style={styles.chatButtonContainer}>
                    <TouchableHighlight
                      onPress={() => initiateChat()}
                      underlayColor="transparent"
                      style={styles.chatButton}>
                      <Text style={styles.chatButtonText}>
                        {I18n.t('start_chat')}
                      </Text>
                    </TouchableHighlight>
                  </View>
                )}

                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingBottom: 5,
                  }}>
                  <PropertyIcons
                    services={property.meta || []}
                    items={['bedroom', 'bathroom', 'parking']}
                  />

                  <Text style={styles.price}>
                    {numberWithCommas(property.meta.price)}{' '}
                    {
                      countries.find(
                        country => country.id === property.address.country,
                      ).currency
                    }
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingBottom: 5,
                  }}>
                  <Text style={[styles.lightText, {flex: 1}]}>
                    {I18n.t('added')} {moment(property.created_at).fromNow()}
                  </Text>

                  <Text style={[styles.lightText, {paddingHorizontal: 5}]}>
                    {property.views} {I18n.t('views')}
                  </Text>

                  <Favorite
                    handleFavoritePress={() => handleFavoritePress(property)}
                    isFavorited={property.isFavorited}
                  />
                </View>

                {property.user.isCompany && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.lightText}>{I18n.t('added_by')}</Text>
                    <TouchableHighlight
                      underlayColor="transparent"
                      onPress={() => loadProfile(property.user)}
                      style={{flex: 1}}>
                      <LocalizedText
                        style={styles.username}
                        en={property.user.name_en}
                        ar={property.user.name_ar}
                      />
                    </TouchableHighlight>
                  </View>
                )}

                <View style={styles.extraInfo}>
                  {!!property.meta.area && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoTitle}>{I18n.t('area')}</Text>
                      <Text style={styles.infoResult}>
                        {property.meta.area} metre
                      </Text>
                    </View>
                  )}

                  <Text style={styles.description}>
                    {property.meta.description}
                  </Text>

                  <Separator style={{ marginVertical:10 }}/>

                  <View >
                    {/*<Text style={{}}>{I18n.t('address')}</Text>*/}

                    <Text style={{fontWeight:'bold',}}>
                      {isRTL
                        ? `${
                            property.address.city_ar
                          }`
                        : `${
                            property.address.city_en
                          }`}

                      {
                        !!block && (
                          ` ${I18n.t('block')} ${block} `
                        )
                      }

                      {
                        !!street && (
                          ` ${I18n.t('street')} ${street} `
                        )
                      }

                      {
                        !!building && (
                          ` ${I18n.t('building')} ${building} `
                        )
                      }

                      {
                        !!description && (
                          `${description} `
                        )
                      }

                    </Text>
                  </View>
                </View>

                {!!property.nearByPlaces.length && (
                  <View>
                    <Separator
                      style={[styles.separator, {marginVertical: 15}]}
                    />

                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text style={[styles.descTitle, {marginBottom: 10}]}>
                        {I18n.t('near_by_places')}
                      </Text>
                      {property.nearByPlaces.map(place => (
                        <Text key={place} style={styles.amenity}>
                          {I18n.t(place)}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {!!property.amenities.length && (
                  <View>
                    <Separator
                      style={[styles.separator, {marginVertical: 15}]}
                    />

                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text style={[styles.descTitle, {marginBottom: 10}]}>
                        {I18n.t('amenities')}
                      </Text>
                      {property.amenities.map(amenity => (
                        <Text key={amenity} style={styles.amenity}>
                          {I18n.t(amenity)}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {!!property.meta.email && (
                  <View>
                    <Separator
                      style={[styles.separator, {marginVertical: 15}]}
                    />
                    <View style={[styles.infoRow]}>
                      <FontAwesome
                        name="envelope-o"
                        size={15}
                        style={{width: 20, height: 15, alignSelf: 'center'}}
                        color={colors.darkGrey}
                      />
                      <Text style={[styles.infoTitle, {paddingHorizontal: 5}]}>
                        {I18n.t('email')}
                      </Text>
                      <Text
                        style={styles.infoResult}
                        onPress={() => {
                          this.sendEmail(property.meta.email);
                        }}>
                        {property.meta.email}
                      </Text>
                    </View>
                  </View>
                )}

                <Separator style={[styles.separator, {marginVertical: 15}]} />

                <View style={[styles.infoRow, {paddingVertical: 5}]}>
                  <FontAwesome
                    name="mobile"
                    size={20}
                    style={{
                      width: 20,
                      height: 20,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 5,
                    }}
                    color={colors.darkGrey}
                  />
                  <Text style={styles.infoTitle}>{I18n.t('mobile')}</Text>
                  <Text
                    style={styles.infoResult}
                    onPress={() => {
                      this.makePhoneCall(property.meta.mobile);
                    }}>
                    {property.meta.mobile}
                  </Text>
                </View>

                {!!property.meta.phone && (
                  <View>
                    <Separator
                      style={[styles.separator, {marginVertical: 15}]}
                    />

                    <View style={[styles.infoRow, {paddingVertical: 5}]}>
                      <FontAwesome
                        name="mobile"
                        size={20}
                        style={{
                          width: 20,
                          height: 20,
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}
                        color={colors.darkGrey}
                      />
                      <Text style={styles.infoTitle}>{I18n.t('phone')}</Text>
                      <Text
                        style={styles.infoResult}
                        onPress={() => {
                          this.makePhoneCall(property.meta.phone);
                        }}>
                        {property.meta.phone}
                      </Text>
                    </View>
                  </View>
                )}

                <Separator style={[styles.separator, {marginVertical: 15}]} />

                {property.video && <YoutubePlayer video={property.video} />}

                {this.state.initialized && (
                  <PropertyMap
                    address={property.address}
                    onPinPress={onPinPress}
                    sceneType={sceneType}
                    setSceneType={setSceneType}
                  />
                )}
              </View>
            </Animated.ScrollView>
          </View>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    padding: 10,
    backgroundColor: 'white',
    minHeight: Dimensions.get('window').height - 250,
  },
  image: {
    width: Dimensions.get('window').width,
    height: 250,
    backgroundColor: colors.fadedWhite,
  },
  tags: {
    marginTop: 10,
    flexDirection: 'row',
  },
  icons: {
    marginTop: 10,
    flexDirection: 'row',
  },
  title: {
    color: '#2c2d30',
    fontWeight: '600',
    textAlign: 'left',
    fontSize: 17,
  },
  descTitle: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#2c2d30',
  },
  address: {
    marginTop: 10,
    fontSize: 14,
    color: '#2c2d30',
  },
  description: {
    marginTop: 10,
    fontSize: 15,
    color: '#384760',
    fontFamily: 'Avenir-Light',
    textAlign: 'left',
  },
  amenity: {
    fontSize: 15,
    textAlign: 'justify',
    color: '#384760',
    fontFamily: 'Avenir-Light',
  },
  username: {
    color: colors.primary,
    textAlign: 'left',
    fontWeight: '500',
    paddingHorizontal: 5,
  },
  label: {
    color: colors.grey,
    fontSize: 12,
  },
  price: {
    fontSize: 17,
    color: colors.fadedBlack,
    fontWeight: '600',
  },
  lightText: {
    color: colors.fadedBlack,
    fontWeight: '100',
    fontSize: 12,
    paddingVertical: 2,
    textAlign: 'left',
  },
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  heroSpacer: {
    height: 250,
    backgroundColor: 'transparent',
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
  },
  extraInfo: {
    marginTop: 5,
  },
  infoTitle: {
    fontWeight: '100',
  },
  infoResult: {
    fontWeight: '500',
    paddingLeft: 10,
    flexWrap:'wrap'
  },
  chatButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  chatButton: {
    backgroundColor: 'tomato',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  chatButtonText: {
    fontSize: 18,
    color: 'white',
  },
});
