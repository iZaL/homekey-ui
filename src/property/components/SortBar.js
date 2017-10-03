/**
 @flow
 */
import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import colors from '../../common/colors';
import I18n from '../../app/common/locale';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheet from '@yfuks/react-native-action-sheet';

let showActionSheet = (sortOptions, onSortItemPress) => {
  let BUTTONS = sortOptions.map(item => item.value);
  BUTTONS.push(I18n.t('cancel'));

  ActionSheet.showActionSheetWithOptions(
    {
      options: BUTTONS,
      cancelButtonIndex: BUTTONS.length - 1,
    },
    buttonIndex => {
      if (buttonIndex !== BUTTONS.length - 1) {
        onSortItemPress(sortOptions[buttonIndex]);
      }
    },
  );
};

let SortBar = ({
  onMapViewPress,
  mapView,
  sortOptions,
  onSortItemPress,
  selectedSortOption,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableHighlight
          style={styles.buttonWrapper}
          onPress={() => {
            showActionSheet(sortOptions, onSortItemPress);
          }}
          activeOpacity={0.6}
          underlayColor="transparent">
          <View style={styles.buttonWrapperInner}>
            <Ionicons name="ios-arrow-down" color={colors.black} size={20} />
            <Text style={styles.button}>
              {I18n.t('sort')} {' '}
            </Text>
            <Text style={styles.sortByText}>
              {I18n.t([selectedSortOption])}
            </Text>
          </View>
        </TouchableHighlight>

        <Text style={styles.separatorHeight}>
          {' '}{'|'}{' '}
        </Text>

        <TouchableHighlight
          style={styles.buttonWrapper}
          onPress={() => {
            onMapViewPress();
          }}
          activeOpacity={0.6}
          underlayColor="transparent">
          <View style={styles.buttonWrapperInner}>
            <Ionicons
              name={mapView ? 'ios-list' : 'ios-globe'}
              color={colors.black}
              size={19}
              style={{paddingHorizontal: 5}}
            />
            <Text style={styles.button}>
              {mapView ? I18n.t('list') : I18n.t('map')}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

SortBar.propTypes = {
  sortOptions: PropTypes.array.isRequired,
  selectedSortOption: PropTypes.string.isRequired,
  onSortItemPress: PropTypes.func.isRequired,
  onMapViewPress: PropTypes.func.isRequired,
  mapView: PropTypes.bool.isRequired,
};

let styles = StyleSheet.create({
  container: {
    padding: 7,
    backgroundColor: '#E7E7E9',
  },
  filterContainer: {
    marginTop: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 5,
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonWrapperInner: {
    flexDirection: 'row',
  },
  button: {
    color: colors.black,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 16,
  },
  separatorHeight: {
    backgroundColor: colors.lightGrey,
    opacity: 0.8,
    width: 0.5,
  },
  locationLabel: {
    color: colors.darkGrey,
    padding: 10,
  },
  sortByText: {
    color: colors.darkGrey,
    paddingHorizontal: 5,
    paddingTop: 2,
  },
});

export default SortBar;
