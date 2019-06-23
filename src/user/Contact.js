import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {View,Text,TouchableHighlight,StyleSheet,Linking} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ACTIONS} from './common/actions';
import {ACTIONS as PROPERTY_ACTIONS} from '../property/common/actions';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

class Contact extends PureComponent {

  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  makeCall = number => {
    let url = `tel:${number}`;

    return Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url);
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Homekey</Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 5,
            paddingTop: 50,
          }}>
          <Text style={[styles.title]} onPress={() => this.makeCall('98009966')}>
            98009966
          </Text>

          <TouchableHighlight onPress={() => this.makeCall('98009966')}>
            <MaterialIcons name="phone" size={30} color="green" />
          </TouchableHighlight>
        </View>

        <View style={{backgroundColor: 'black', marginVertical: 10}} />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 5,
          }}>
          <Text style={[styles.title]} onPress={() => this.makeCall('98009977')}>
            98009977
          </Text>

          <TouchableHighlight onPress={() => this.makeCall('98009977')}>
            <MaterialIcons name="phone" size={30} color="green" />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...ACTIONS, ...PROPERTY_ACTIONS}, dispatch),
  };
}

function mapStateToProps(state, props) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Contact);


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  subText: {
    fontSize: 25,
    textAlign: 'center',
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '800',
  },
  buttonContainer: {
    paddingTop: 30,
    flexDirection: 'row',
  },
  title: {
    paddingHorizontal: 10,
  },
});

