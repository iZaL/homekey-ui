/**
 @flow
 */
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import PropertyIcons from '../components/PropertyIcons';
import Swiper from 'react-native-swiper';
import Favorite from '../components/Favorite';
import colors from '../../common/colors';
import moment from 'moment';
import Separator from './../../components/Separator';
import {CountryPropType} from './../common/proptypes';
import {numberWithCommas} from '../../common/functions';
import I18n from './../../app/common/locale';

export default class PropertyListScene extends PureComponent {
  static propTypes = {
    collection: PropTypes.array.isRequired,
    loadScene: PropTypes.func.isRequired,
    handleFavoritePress: PropTypes.func.isRequired,
    country: CountryPropType.isRequired,
    isFetching: PropTypes.bool.isRequired,
    refreshProperties: PropTypes.func.isRequired,
  };

  shouldItemUpdate = (prev, next) => {
    return prev.item !== next.item;
  };

  imageSlider = item => {
    let {loadScene} = this.props;
    return item.images.map(image =>
      <TouchableHighlight
        key={image}
        onPress={() => loadScene(item)}
        underlayColor="transparent"
        style={{flex: 1}}>
        <Image style={styles.image} source={{uri: image}} resizeMode="cover" />
      </TouchableHighlight>,
    );
  };

  renderRow = ({item, index}) => {
    const {loadScene, handleFavoritePress} = this.props;

    return (
      <View style={[styles.row]} key={item._id}>
        <TouchableHighlight
          onPress={() => loadScene(item)}
          underlayColor="transparent">
          <Text style={styles.title}>
            {item.title}
          </Text>
        </TouchableHighlight>

        <Swiper
          loadMinimal
          loadMinimalSize={1}
          style={styles.wrapper}
          loop={false}
          height={250}>
          {this.imageSlider(item)}
        </Swiper>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 10,
            paddingTop: 10,
          }}>

          <PropertyIcons
            services={item.meta || []}
            items={['bedroom', 'bathroom', 'parking']}
          />

          <Text style={styles.price}>
            {numberWithCommas(item.meta.price)} {item.country.currency}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 10,
            paddingTop: 5,
          }}>
          <Text style={[styles.lightText, {flex: 1}]}>
            {I18n.t('added')} {moment(item.created_at).fromNow()}
          </Text>

          <Text style={[styles.lightText, {paddingHorizontal: 5}]}>
            {item.views} {I18n.t('views')}
          </Text>

          <Favorite
            handleFavoritePress={() => handleFavoritePress(item)}
            isFavorited={item.isFavorited}
          />
        </View>
      </View>
    );
  };

  render() {
    const {
      collection,
      isFetching,
      fetchProperties,
      refreshProperties,
    } = this.props;

    return (
      <FlatList
        style={styles.container}
        data={collection}
        renderItem={this.renderRow}
        enableEmptySections={true}
        ref="listView"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        initialListSize={20}
        onEndReachedThreshold={1}
        onEndReached={() => !isFetching && fetchProperties()}
        ItemSeparatorComponent={() =>
          <Separator style={{marginVertical: 10}} />}
        getItemLayout={(data, index) => ({
          length: 348,
          offset: 348 * index,
          index,
        })}
        onRefresh={() => refreshProperties()}
        refreshing={isFetching}
        scrollEventThrottle={120}
        shouldItemUpdate={this.shouldItemUpdate}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  wrapper: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  row: {
    flex: 1,
  },
  title: {
    flex: 1,
    color: '#2c2d30',
    margin: 10,
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'left',
  },
  image: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 250,
    backgroundColor: colors.fadedWhite,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  loadingView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  price: {
    fontWeight: '600',
    fontSize: 16,
  },
  loadingImage: {
    width: 60,
    height: 60,
  },
  lightText: {
    color: colors.fadedBlack,
    fontWeight: '100',
    fontSize: 12,
    textAlign: 'left',
  },
});
