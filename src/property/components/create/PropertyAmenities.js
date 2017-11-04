import PropTypes from 'prop-types';
/**
 * @flow
 */
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../common/colors';
import Separator from './../../../components/Separator';

export default class PropertyAmenities extends React.Component {
  static propTypes = {
    selected: PropTypes.array.isRequired,
    updateListing: PropTypes.func.isRequired,
    collection: PropTypes.array.isRequired,
  };

  state = {
    descriptionHeight: 40,
    disabled: true,
  };

  renderRow = ({item}) => {
    const {updateListing, selected} = this.props;
    return (
      <TouchableHighlight
        style={{flex: 1}}
        onPress={() => updateListing(item.key)}
        underlayColor="transparent"
        key={item}>
        <View style={styles.row}>
          <Text style={styles.title}>{item.value}</Text>
          <View style={styles.checkbox}>
            {selected &&
              selected.includes(item.key) && (
                <FontAwesome
                  key={item.key}
                  name="check"
                  size={16}
                  color="green"
                />
              )}
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const {collection, header, footer} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.menuContainer}>{header}</View>
        <View style={{flex: 5}}>
          <FlatList
            data={collection}
            style={styles.list}
            enableEmptySections={true}
            renderItem={this.renderRow}
            automaticallyAdjustContentInsets={false}
            showsVerticalScrollIndicator={false}
            contentInset={{bottom: 100}}
            ItemSeparatorComponent={() => (
              <Separator style={{marginVertical: 10}} />
            )}
          />
        </View>
        {footer}
      </View>
    );
  }
}

PropertyAmenities.prototypes = {
  collection: PropTypes.array.isRequired,
  updateListing: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: colors.lightGrey,
    paddingHorizontal: 10,
    paddingVertical: 30,
  },
  list: {
    flex: 1,
    padding: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: colors.black,
    textAlign: 'left',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderColor: colors.darkGrey,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});
