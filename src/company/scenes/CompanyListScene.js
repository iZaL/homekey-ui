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

  renderRow = ({item, index}) => {
    const {loadScene} = this.props;

    return (
      <TouchableHighlight
        onPress={() => loadScene(item)}
        underlayColor="transparent"
        key={index}
        style={styles.row}>
        <View style={styles.companyInfoContainer}>

          {
            item.image &&
            <View>
              <Image source={{uri: item.image}} style={styles.companyLogo}/>
            </View>

          }

          <View
            style={{
              flex: 1,
              paddingHorizontal: 5,
            }}>
            <LocalizedText
              style={styles.companyTitle}
              en={item.name_en}
              ar={item.name_ar}
            />

            <LocalizedText
              style={styles.companyDescription}
              en={item.name_en}
              ar={item.name_ar}
            />
          </View>
        </View>
      </TouchableHighlight>
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
        ItemSeparatorComponent={() => <Separator style={{marginVertical: 5}}/>}
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
    padding: 5,
  },
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {},
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
  companyImage: {
    flex: 1,
    width: null,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyLogo: {
    width: 75,
    height: 75,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 4,
    backgroundColor: colors.fadedWhite,
  },
  companyInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyTitle: {
    color: colors.darkGrey,
    backgroundColor: 'transparent',
    fontSize: 17,
    textAlign: 'left',
  },
  openText: {
    color: colors.green,
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 2,
  },
  openCloseIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 10,
    marginTop: 2,
  },
  companyDescription: {
    color: colors.darkGrey,
    backgroundColor: 'transparent',
    fontSize: 14,
    fontWeight: '100',
    textAlign: 'left',
    opacity: 0.8,
  },
});
