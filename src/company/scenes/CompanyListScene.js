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
import Swiper from 'react-native-swiper';
import colors from '../../common/colors';
import moment from 'moment';
import Separator from './../../components/Separator';
import {numberWithCommas} from '../../common/functions';
import I18n from './../../app/common/locale';
import {CountryPropType} from './../../property/common/proptypes';
import LocalizedText from '../../components/LocalizedText';

export default class CompanyListScene extends PureComponent {
  static propTypes = {
    collection: PropTypes.array.isRequired,
    loadScene: PropTypes.func.isRequired,
    country: CountryPropType.isRequired,
    isFetching: PropTypes.bool.isRequired,
    refreshCollection: PropTypes.func.isRequired,
    fetchCollection: PropTypes.func.isRequired,
  };

  shouldItemUpdate = (prev, next) => {
    return prev.item !== next.item;
  };

  renderRow = ({item}) => {
    const {loadScene} = this.props;

    return (
      <View key={item._id} style={[styles.row]}>
        <TouchableHighlight
          onPress={() => loadScene(item)}
          underlayColor="transparent">
          <View style={styles.rowContent}>
            <LocalizedText
              style={styles.title}
              en={item.name_en}
              ar={item.name_ar}
            />
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  render() {
    const {
      collection,
      isFetching,
      fetchCollection,
      refreshCollection,
    } = this.props;

    return (
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.list}
        data={collection}
        renderItem={this.renderRow}
        enableEmptySections={true}
        ref="listView"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        initialListSize={20}
        onEndReachedThreshold={1}
        onEndReached={() => !isFetching && fetchCollection()}
        ItemSeparatorComponent={() =>
          <Separator style={{marginVertical: 10}} />}
        getItemLayout={(data, index) => ({
          length: 348,
          offset: 348 * index,
          index,
        })}
        onRefresh={() => refreshCollection()}
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
    paddingTop: 20,
  },
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    height: 150,
    width: 150,
    borderRadius: 75,
    justifyContent: 'center',
    borderColor: colors.mediumGrey,
    backgroundColor: 'white',
    borderWidth: 3,
    margin: 10,
    maxHeight: 150,
  },
  image: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 250,
    backgroundColor: colors.fadedWhite,
  },
  rowContent: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    color: colors.darkGrey,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 20,
  },
});
