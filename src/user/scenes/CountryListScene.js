/**
 @flow
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions
} from 'react-native';
import colors from '../../common/colors';
import {CountryPropType} from '../../property/common/proptypes';

export default class CountryListScene extends Component {
  static propTypes = {
    countries: PropTypes.array.isRequired,
    onCountrySelect: PropTypes.func.isRequired,
    country: CountryPropType.isRequired,
  };

  renderRow = ({item, index}) => {
    let {onCountrySelect, country} = this.props;
    return (
      <TouchableHighlight
        onPress={() => onCountrySelect(item.id)}
        underlayColor="transparent"
        key={index}
      >
        <View style={styles.row} >
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

    );
  };

  render() {
    const {countries} = this.props;
    return (
      <FlatList
        style={styles.container}
        data={countries}
        renderItem={this.renderRow}
        enableEmptySections={true}
        ref="listView"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        numColumns={2}
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
  list: {},
  row: {
    height: (Dimensions.get('window').width / 2) - 40,
    width: (Dimensions.get('window').width / 2) - 40,
    borderRadius: ((Dimensions.get('window').width / 2) - 40 )/2,
    justifyContent: 'center',
    borderColor: colors.mediumGrey,
    backgroundColor: 'white',
    borderWidth: 3,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  rowContent: {
    // flexDirection: 'row',
  },
  title: {
    color: colors.darkGrey,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 20,
    backgroundColor:'transparent'
  },
  separator: {
    flex: 1,
    height: 0.5,
    backgroundColor: colors.lightGrey,
  },
});
