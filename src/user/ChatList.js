import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SELECTORS as AUTH_SELECTORS} from '../auth/common/selectors';
import {ACTIONS as USER_ACTIONS} from '../user/common/actions';
import ChatListScene from './scenes/ChatListScene';
import {SELECTORS as PROPERTY_SELECTORS} from '../property/common/selectors';
import {Text, View} from 'react-native';

class ChatList extends Component {
  componentDidMount() {
    this.props.actions.fetchThreads();
  }

  loadChatScene = item => {
    this.props.navigation.navigate('ChatThreadScene', {
      thread_id: item._id,
      title: item.property ? item.property.meta.title : '',
    });
  };

  render() {
    let {threads, user} = this.props;

    if (!threads.length) {
      return (
        <View style={{padding: 10}}>
          <Text>No chats</Text>
        </View>
      );
    }

    return (
      <ChatListScene
        threads={threads}
        loadChatScene={this.loadChatScene}
        user={user}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...USER_ACTIONS}, dispatch),
  };
}

function mapStateToProps(state) {
  return {
    isAuthenticated: AUTH_SELECTORS.isAuthenticated(state),
    user: AUTH_SELECTORS.getCurrentUser(state) || {},
    threads: PROPERTY_SELECTORS.getThreads(state),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatList);
