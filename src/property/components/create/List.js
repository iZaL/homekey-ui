/**
 * @flow
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import colors from '../../../common/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Separator from './../../../components/Separator';
import {isRTL} from '../../../app/common/locale';

export default class List extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    updateListing: PropTypes.func.isRequired,
    collection: PropTypes.array.isRequired,
    selected: PropTypes.string,
  };

  renderRow = ({item}) => {
    const {updateListing, field, selected} = this.props;
    return (
      <TouchableHighlight
        onPress={() => updateListing(field, item.key)}
        underlayColor="transparent"
        key={item.key}>
        <View style={styles.row}>
          <Text
            style={[
              styles.title,
              selected === item.key && {color: colors.primary},
            ]}>
            {item.value}
          </Text>
          <Ionicons
            name={isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'}
            color={colors.lightGrey}
            size={30}
          />
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const {collection, header} = this.props;

    return (
      <FlatList
        data={collection}
        style={styles.container}
        enableEmptySections={true}
        renderItem={this.renderRow}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={false}
        contentInset={{bottom: 150}}
        removeClippedSubviews={false}
        ListHeaderComponent={() => header}
        ItemSeparatorComponent={() => <Separator />}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    flex: 1,
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'left',
  },
});
