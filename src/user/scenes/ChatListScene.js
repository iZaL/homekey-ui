import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import colors from '../../common/colors';
import Avatar from 'react-native-gifted-chat/src/Avatar';

export default class ChatListScene extends Component {
  static propTypes = {
    threads: PropTypes.array.isRequired,
    loadChatScene: PropTypes.func.isRequired,
  };

  renderRow = ({item, index}) => {
    let {loadChatScene, user} = this.props;

    return (
      <TouchableOpacity onPress={() => loadChatScene(item)}>
        <View style={styles.row}>
          <View style={{justifyContent: 'center'}}>
            <Avatar
              currentMessage={{
                user: {
                  name: item.recent.user.name,
                },
              }}
            />
          </View>

          <View />

          <View style={styles.rowContentContainer}>
            {item.property && (
              <Text style={styles.propertyTitle}>
                {item.property.meta.title}
              </Text>
            )}

            {user._id !== item.recent.user._id && (
              <Text style={styles.userName}>{item.recent.user.name}</Text>
            )}

            <Text style={styles.messageText}>{item.recent.text}</Text>
          </View>

          <View>
            <Text style={styles.date}>
              {moment(item.recent.created_at).fromNow()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderSeparator = () => {
    return <View style={[styles.separator]} />;
  };

  render() {
    let {threads} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.container}
          data={threads}
          renderItem={this.renderRow}
          enableEmptySections={true}
          ref="listView"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          initialListSize={20}
          scrollEventThrottle={120}
          removeClippedSubviews={false}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 5,
  },
  rightButton: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 10,
    padding: 0,
  },
  topGroup: {
    flexDirection: 'row',
    margin: 10,
  },
  myFriends: {
    flex: 1,
    color: 'gray',
    fontSize: 16,
    padding: 5,
  },
  inviteFriends: {
    color: 'tomato',
    padding: 5,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  rowContentContainer: {
    flex: 1,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 6,
  },
  profileName: {
    marginLeft: 6,
    fontSize: 16,
  },
  separator: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#E7E7E7',
    marginVertical: 5,
  },
  propertyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: 'black',
    paddingTop: 2,
    textAlign: 'left',
  },
  userName: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.black,
    paddingTop: 2,
    textAlign: 'left',
  },
  messageText: {
    fontSize: 15,
    fontWeight: '300',
    color: colors.darkGrey,
    paddingTop: 2,
    textAlign: 'left',
  },
  date: {
    fontSize: 11,
    color: colors.primary,
    paddingTop: 5,
  },
});
