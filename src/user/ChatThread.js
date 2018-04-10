import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SELECTORS as AUTH_SELECTORS} from '../auth/common/selectors';
import {SELECTORS as PROPERTY_SELECTORS} from '../property/common/selectors';
import {ACTIONS as AUTH_ACTIONS} from '../auth/common/actions';
import {ACTIONS as USER_ACTIONS} from '../user/common/actions';
import {ACTIONS as PROPERTY_ACTIONS} from '../property/common/actions';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {isRTL} from '../app/common/locale';
import ChatHeader from './components/ChatHeader';

class ChatThread extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.title}`,
  });

  componentDidMount() {
    if (this.props.navigation.state.params.thread_id) {
      this.props.actions.subscribeToSocket({
        thread_id: this.props.navigation.state.params.thread_id,
      });
    }

    this.props.actions.fetchThreadByID({
      thread_id: this.props.navigation.state.params.thread_id,
    });
  }

  componentWillUnmount() {
    //@todo : save message locally, and update database at one time while the componentUnMounts
  }

  onSend = () => {
    let {thread, user} = this.props;

    if (thread) {
      const message = {
        _id: Math.round(Math.random() * 1000000),
        text: this.state.text,
        createdAt: new Date(),
        sent: true,
        received: true,
        property_id: thread.property_id,
        user: {
          name: user.name_ar ? user.name_ar : user.name_en,
          _id: user._id,
        },
        thread_id: thread._id,
      };

      this.props.actions.addMessage({
        message: message,
      });

      this.props.actions.broadcastMessage({
        message: message,
      });
    }
  };

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          },
        }}
      />
    );
  };

  onTextChange = text => {
    this.setState({
      text: text,
    });
  };

  onTitlePress = (property: object) => {
    this.props.navigation.navigate('PropertyDetailScene', {
      property: property,
    });
  };

  render() {
    let {thread, user} = this.props;
    const messages = thread && thread.messages ? thread.messages : [];
    return (
      <View style={{flex: 1}}>
        {thread.property && (
          <ChatHeader
            property={thread.property}
            onTitlePress={this.onTitlePress}
          />
        )}
        <GiftedChat
          messages={messages.concat().reverse()}
          text={this.state.text}
          onInputTextChanged={this.onTextChange}
          onSend={this.onSend}
          user={{
            _id: user._id,
          }}
          textInputStyle={styles.textInputStyle}
          listViewProps={{
            removeClippedSubviews: false,
          }}
          forceGetKeyboardHeight={true}
          bottomOffset={48}
        />
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {...AUTH_ACTIONS, ...PROPERTY_ACTIONS, ...USER_ACTIONS},
      dispatch,
    ),
  };
}

function mapStateToProps(state, props) {
  return {
    isAuthenticated: AUTH_SELECTORS.isAuthenticated(state),
    user: AUTH_SELECTORS.getCurrentUser(state) || {},
    thread: PROPERTY_SELECTORS.getThreadDetail(state, props),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatThread);

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  textInputStyle: {
    textAlign: isRTL ? 'right' : 'left',
  },
});
