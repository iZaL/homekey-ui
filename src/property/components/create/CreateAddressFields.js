import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import AddressFormFields from './AddressFormFields';
import MapButtons from './MapButtons';
import {Title, Divider} from 'react-native-paper';
import MapView from 'react-native-maps';
import I18n from './../../../app/common/locale';
import colors from '../../../common/colors';
import LocalizedText from '../../../components/LocalizedText';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class extends PureComponent {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  };

  static defaultProps = {
    address: {},
  };

  constructor(props) {
    super(props);

    let {block, street, description, building, avenue} = this.props.address;

    this.state = {
      label: 'Home',
      block: block,
      street: street,
      description: description,
      building: building,
      avenue: avenue,
      initialized: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        initialized: true,
      });
    }, 1000);
  }

  hideScreen = () => {
    this.props.onCancel();
  };

  saveAddress = () => {
    this.props.onSave({
      ...this.state,
    });
  };

  updateFormFields = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  render() {
    const {
      block,
      street,
      label,
      initialized,
      description,
      building,
      avenue,
    } = this.state;
    let {latitude, longitude, city_en, city_ar} = this.props.address;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 40}}>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={Platform.OS === 'ios' ? -60 : 0}
          enabled>
          <View style={styles.map}>
            {initialized && (
              <MapView
                ref={ref => (this.map = ref)}
                style={{
                  height: 250,
                }}
                initialRegion={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
                cacheEnabled={true}>
                <MapView.Marker
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                  // centerOffset={{x: -18, y: -60}}
                  // anchor={{x: 0.69, y: 1}}
                />
              </MapView>
            )}
          </View>

          <Divider style={{marginVertical: 10}} />

          <Title style={{textAlign: 'center'}}>
            <LocalizedText en={city_en} ar={city_ar} />
          </Title>

          <Divider style={{marginVertical: 10}} />
          <AddressFormFields
            block={block}
            street={street}
            building={building}
            avenue={avenue}
            description={description}
            label={label}
            updateFields={this.updateFormFields}
          />
          <MapButtons save={this.saveAddress} close={this.hideScreen} />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInputWrapper: {},
  searchInputContainer: {
    flexDirection: 'row',
  },
  map: {
    height: 250,
    backgroundColor: colors.lightGrey,
  },
});
