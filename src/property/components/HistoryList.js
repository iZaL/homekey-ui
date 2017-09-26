import React, {Component} from 'react';
import {
  StyleSheet,
  SwipeableListView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Separator from '../../components/Separator';
import colors from '../../common/colors';
import PropertyIcons from './PropertyIcons';
import I18n from '../../app/common/locale';

export default class HistoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: SwipeableListView.getNewDataSource(),
    };
  }

  getDataSource = () => {
    let items = this.props.collection;
    return this.state.dataSource.cloneWithRowsAndSections(items);
  };

  renderButtons = (rowData, sectionID, rowID) => {
    let {removeFilter} = this.props;
    return (
      <View style={styles.actionsContainer}>
        <TouchableHighlight
          onPress={() => {
            removeFilter(rowID, rowData);
          }}
          underlayColor="transparent">
          <Text style={styles.buttonText}>
            {I18n.t('remove')}
          </Text>
        </TouchableHighlight>
      </View>
    );
  };

  renderRow = (item, sectionID, rowID) => {
    let {setFilter, countries} = this.props;
    let type = rowID;
    let filter = item;
    return (
      <View key={sectionID}>
        <TouchableHighlight
          onPress={() => setFilter(rowID, item)}
          underlayColor={colors.lightGrey}
          style={styles.row}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flex: 1, paddingHorizontal: 10}}>
              <Text style={styles.title}>
                {filter.category === 'any'
                  ? I18n.t('properties')
                  : `${I18n.t(filter.category)} `}{' '}
                {`${I18n.t([type])}`} {I18n.t('in')}{' '}
                {filter.searchString
                  ? filter.searchString
                  : countries.find(country => country.id === filter.country)
                      .name}
              </Text>

              <PropertyIcons
                services={filter || []}
                items={['bedroom', 'bathroom', 'parking']}
              />

              <Text style={styles.title}>
                <Text style={{fontWeight: '500'}}>{I18n.t('price')}:</Text>{' '}
                {filter.priceFrom === 'any'
                  ? I18n.t('any')
                  : filter.priceFrom}{' '}
                - {filter.priceTo === 'any' ? I18n.t('any') : filter.priceTo}
              </Text>

              <Text style={styles.title}>
                {filter.total
                  ? filter.total + ' ' + I18n.t('properties_found')
                  : I18n.t('no_properties_found')}
              </Text>
            </View>
          </View>
        </TouchableHighlight>

        <Separator />
      </View>
    );
  };

  render() {
    return (
      <SwipeableListView
        dataSource={this.getDataSource()}
        maxSwipeDistance={100}
        renderQuickActions={this.renderButtons}
        renderRow={this.renderRow}
        style={styles.container}
        removeClippedSubviews={false}
      />
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  thumb: {
    width: 64,
    height: 64,
  },
  text: {
    flex: 1,
    color: 'white',
  },
  actionsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    justifyContent: 'flex-end',
  },
  lightText: {
    color: colors.fadedBlack,
    fontWeight: '100',
    fontSize: 13,
  },
  searchText: {
    color: colors.darkGrey,
    paddingLeft: 10,
    fontSize: 17,
  },
  searchHistory: {
    padding: 10,
  },
  historyTitle: {
    color: colors.darkGrey,
    fontWeight: '100',
    fontSize: 15,
  },
  historyContent: {
    paddingTop: 5,
  },
  title: {
    color: 'black',
    fontWeight: '100',
    fontSize: 16,
    textAlign: 'left',
  },
  historyContainer: {
    paddingTop: 10,
  },
  buttonText: {
    color: colors.fadedWhite,
    fontWeight: '100',
    fontSize: 15,
    padding: 10,
  },
});
