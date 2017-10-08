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

export default class List extends Component {
  static propTypes = {
    selected: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    ranges: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    hint: PropTypes.string,
  };

  renderRow = ({item, index}) => {
    const {onSelect, selected, hint} = this.props;
    return (
      <View style={styles.row} key={index}>
        <TouchableHighlight
          hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}
          onPress={() => {
            onSelect(item);
          }}
          underlayColor="transparent">
          <Text
            style={[
              styles.price,
              selected === item.key && {
                color: colors.primary,
                fontWeight: '500',
              },
            ]}>
            {item.value}

            <Text style={styles.hint}>
              {item.key !== 'any' && hint && ` ${hint}`}
            </Text>
          </Text>
        </TouchableHighlight>
      </View>
    );
  };

  render() {
    const {ranges, title, titleStyle, selected} = this.props;

    return (
      <View style={styles.container}>
        <Text style={[styles.title, titleStyle]}>
          {title}
        </Text>
        <FlatList
          data={ranges}
          renderItem={this.renderRow}
          style={styles.container}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          initialListSize={6}
          onEndReachedThreshold={0}
          scrollEventThrottle={120}
          removeClippedSubviews={false}
          horizontal={true}
          extraData={selected}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
  },
  contentContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
  },
  row: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  listStyle: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  price: {
    fontSize: 14,
  },
  hint: {
    fontSize: 12,
  },
});
