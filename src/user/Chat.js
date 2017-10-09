import React, {PureComponent} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SELECTORS as AUTH_SELECTORS} from '../auth/common/selectors';
import {SELECTORS as PROPERTY_SELECTORS} from '../property/common/selectors';
import {ACTIONS as AUTH_ACTIONS} from '../auth/common/actions';
import {ACTIONS as USER_ACTIONS} from '../user/common/actions';
import {ACTIONS as PROPERTY_ACTIONS} from '../property/common/actions';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {isRTL} from '../app/common/locale';

class Chat extends PureComponent {
  constructor(props) {
    super(props);
    this.property = this.props.navigation.state.params.property;
    this.state = {
      text: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.thread && nextProps.thread) {
      this.props.actions.subscribeToSocket({
        thread_id: nextProps.thread._id,
      });
    }
  }

  componentDidMount() {
    if (this.props.thread) {
      this.props.actions.subscribeToSocket({
        thread_id: this.props.thread._id,
      });
    } else {
      this.props.actions.fetchPropertyThread({
        property_id: this.property._id,
      });
    }
  }

  onSend = () => {
    const message = {
      _id: Math.round(Math.random() * 1000000),
      text: this.state.text,
      createdAt: new Date(),
      sent: true,
      received: true,
      property_id: this.property._id,
      user: {
        name: this.props.user.name_ar
          ? this.props.user.name_ar
          : this.props.user.name_en,
        _id: this.props.user._id,
      },
      thread_id: this.props.thread ? this.props.thread._id : null,
    };

    if (this.props.thread) {
      this.props.actions.broadcastMessage({
        message: message,
      });
      this.props.actions.addMessage({
        message: message,
      });
    } else {
      this.props.actions.createThread({
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

  render() {
    let {thread, user} = this.props;
    const messages = thread && thread.messages ? thread.messages : [];
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <GiftedChat
          messages={messages.concat().reverse()}
          text={this.state.text}
          onInputTextChanged={this.onTextChange}
          onSend={this.onSend}
          user={{
            _id: user._id,
          }}
          renderBubble={this.renderBubble}
          textInputStyle={styles.textInputStyle}
          listViewProps={{
            removeClippedSubviews: false,
          }}
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
    thread: PROPERTY_SELECTORS.getPropertyThread(state, props),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

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
