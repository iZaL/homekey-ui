/**
 @flow
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  FlatList,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import colors from '../../common/colors';
import {CountryPropType} from '../../property/common/proptypes';

export default class CountryListScene extends Component {
  static propTypes = {
    countries: PropTypes.array.isRequired,
    onCountrySelect: PropTypes.func.isRequired,
    country: CountryPropType.isRequired,
  };

  renderRow = ({item}) => {
    let {onCountrySelect, country} = this.props;
    return (
      <View style={styles.row} key={item.id}>
        <TouchableHighlight
          onPress={() => onCountrySelect(item.id)}
          underlayColor="transparent">
          <View style={styles.rowContent}>
            <Text
              style={[
                styles.title,
                country.id === item.id && {
                  color: colors.primary,
                  fontWeight: '500',
                },
              ]}>
              {item.name}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  renderSeparator = (sectionID: number, rowID: number) => {
    return <View style={styles.separator} key={`${sectionID}-${rowID}`} />;
  };

  render() {
    const {countries} = this.props;
    return (
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.list}
        data={countries}
        renderItem={this.renderRow}
        enableEmptySections={true}
        ref="listView"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fadedWhite,
    paddingTop: 20,
  },
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  separator: {
    flex: 1,
    height: 0.5,
    backgroundColor: colors.lightGrey,
  },
});
