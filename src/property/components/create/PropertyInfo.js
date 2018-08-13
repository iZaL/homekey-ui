/**
 * @flow
 */
import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Picker,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Platform
} from 'react-native';
import colors from '../../../common/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import I18n, {isRTL} from '../../../app/common/locale';
import FormLabel from '../../../components/FormLabel';
import FormTextInput from '../../../components/FormTextInput';
import PropTypes from 'prop-types';

const deviceHeight = Dimensions.get('window').height;

class AnimatedPicker extends Component {
  componentDidMount() {
    Animated.timing(this.props.offset, {
      duration: 300,
      toValue: 100,
    }).start();
  }

  closeModal = () => {
    Animated.timing(this.props.offset, {
      duration: 300,
      toValue: deviceHeight,
    }).start(this.props.closeModal);
  };

  render() {
    const {items, changeItem, selectedItem} = this.props;
    return (
      <View style={{flex: 1}}>
        <TouchableHighlight
          onPress={this.closeModal}
          underlayColor="transparent"
          style={styles.closeButton}>
          <Ionicons name="ios-close" size={30} color="black" />
        </TouchableHighlight>
        <Picker
          selectedValue={selectedItem}
          onValueChange={item => changeItem('gender', item)}>
          {items.map(item => (
            <Picker.Item key={item} value={item} label={item} />
          ))}
        </Picker>
      </View>
    );
  }
}

export default class PropertyInfo extends Component {
  static propTypes = {
    attributes: PropTypes.object.isRequired,
    genders: PropTypes.array.isRequired,
    onFieldChange: PropTypes.func.isRequired,
  };

  state = {
    descriptionHeight: 0,
    modal: false,
    offset: new Animated.Value(100),
  };

  selectItem = (field, value) => {
    this.setState({modal: false});
    this.props.onFieldChange(field, value);
    //
    // setTimeout(
    //   () => {
    //     this.refs.scrollView.scrollTo({
    //       y: Dimensions.get('window').height,
    //       animated: true,
    //     });
    //   }
    // ,1000);

  };

  openModal = () => {
    this.refs.scrollView.scrollTo({
      y: Dimensions.get('window').height,
      animated: true,
    });
    this.setState({modal: true});
  };

  render() {
    const {
      onFieldChange,
      attributes,
      header,
      footer,
      genders,
      country,
    } = this.props;
    const {
      description,
      price,
      area,
      gender,
      mobile,
      phone,
      email,
    } = attributes.meta;

    let priceTitle;
    switch (attributes.type) {
      case 'for_sale':
        priceTitle = `${I18n.t('selling_price_in')} ${country.currency}`;
        break;
      default:
        priceTitle = `${I18n.t('rent_monthly_in')} ${country.currency}`;
        break;
    }


    if(this.state.modal) {
      return (
        <AnimatedPicker
          closeModal={() => this.setState({modal: false})}
          offset={this.state.offset}
          changeItem={this.selectItem}
          selectedItem={gender}
          items={genders}
        />
      )
    }


    return (

      <ScrollView
        style={styles.container}
        // contentInset={{bottom: 60}}
        ref="scrollView"
      >
        <KeyboardAvoidingView
          behavior='position'
          keyboardVerticalOffset={Platform.OS === 'ios' ? -60 : 0}
          enabled
        >

            {/*{header}*/}

            <View style={styles.menuContainer}>
              <View style={{flexDirection: 'row'}}>
                <FormLabel title={I18n.t('describe_your_property')} />
                <Text style={styles.required}>*</Text>
              </View>

              <FormTextInput
                style={{
                  height: Math.max(40, this.state.descriptionHeight),
                }}
                onContentSizeChange={event => {
                  this.setState({
                    descriptionHeight: event.nativeEvent.contentSize.height,
                  });
                }}
                multiline={true}
                onChangeText={value => onFieldChange('description', value)}
                value={description}
                enablesReturnKeyAutomatically={true}
                returnKeyType="done"
                placeholder={I18n.t('describe_your_property')}
                autoFocus={false}
              />

              <View style={{flexDirection: 'row'}}>
                <FormLabel title={priceTitle} />
                <Text style={styles.required}>*</Text>
              </View>

              <FormTextInput
                onChangeText={value => onFieldChange('price', value)}
                value={price.toString()}
                maxLength={10}
                placeholder={I18n.t('price')}
                keyboardType="numeric"
                returnKeyType="done"
              />

              <View style={{flexDirection: 'row'}}>
                <FormLabel title={I18n.t('mobile')} />
                <Text style={styles.required}>*</Text>
              </View>

              <FormTextInput
                onChangeText={value => onFieldChange('mobile', value)}
                value={mobile && mobile.toString()}
                maxLength={12}
                placeholder={I18n.t('mobile')}
                keyboardType="numeric"
                returnKeyType="done"
              />

              <FormLabel title={I18n.t('email')} />
              <FormTextInput
                onChangeText={value => onFieldChange('email', value)}
                value={email}
                maxLength={30}
                placeholder={I18n.t('email')}
                keyboardType="email-address"
                returnKeyType="done"
              />

              <View style={{flexDirection: 'row'}}>
                <FormLabel title={I18n.t('space')} />
                <Text style={styles.hint}>{I18n.t('metre')}</Text>
              </View>
              <FormTextInput
                onChangeText={value => onFieldChange('area', value)}
                value={area ? area.toString() : ''}
                maxLength={6}
                placeholder={I18n.t('space_of_your_property_in_metre')}
                keyboardType="numeric"
                returnKeyType="done"
              />

              <FormLabel title={I18n.t('phone')} />
              <FormTextInput
                onChangeText={value => onFieldChange('phone', value)}
                value={phone ? phone.toString() : ''}
                maxLength={12}
                placeholder={I18n.t('phone')}
                keyboardType="numeric"
                returnKeyType="done"
              />

              <FormLabel title={I18n.t('property_for')} />
              <TouchableHighlight
                onPress={() => this.openModal()}
                underlayColor="transparent"
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                style={{marginBottom:50}}
              >
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={styles.textBox}>{gender} </Text>
                  <FontAwesome name="angle-down" size={20} color="black" />
                </View>
              </TouchableHighlight>


            </View>

        </KeyboardAvoidingView>
        {footer}



      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  menuContainer: {
    padding: 10,
    paddingVertical: 30,
    backgroundColor: 'white',
  },
  image: {
    width: 150,
    height: 150,
  },
  label: {
    fontSize: 14,
    color: colors.darkGrey,
    marginBottom: 5,
    fontWeight: '100',
    textAlign: 'left',
  },
  textInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 5,
    borderColor: colors.lightGrey,
    borderRadius: 2,
    borderWidth: 1,
    fontSize: 16,
    color: colors.darkGrey,
    fontWeight: '100',
    textAlign: isRTL ? 'right' : 'left',
  },
  textBox: {
    fontSize: 18,
    color: colors.darkGrey,
    fontWeight: '100',
  },
  closeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopColor: '#e2e2e2',
    borderTopWidth: 1,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
  },
  closeButton: {
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: 'flex-end',
  },
  buttonText: {
    textAlign: 'center',
  },
  required: {
    color: colors.primary,
  },
  hint: {
    paddingHorizontal: 5,
    color: colors.mediumGrey,
  },
});
