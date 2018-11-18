import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ACTIONS} from '../user/common/actions';
import {ACTIONS as APP_ACTIONS} from './common/actions';
import LanguageSelectScene from './scenes/LanguageSelectScene';

class LanguageSelect extends Component {
  onLanguageSelect = name => {
    if (this.props.app.language === name) {
      return this.props.navigation.goBack();
    }

    this.props.actions.setLanguage(name);
  };

  render() {
    const {app} = this.props;
    return (
      <LanguageSelectScene
        onLanguageSelect={this.onLanguageSelect}
        selectedLanguage={app.language}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    app: state.appReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...ACTIONS, ...APP_ACTIONS}, dispatch)};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LanguageSelect);
