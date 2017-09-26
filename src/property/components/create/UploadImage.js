/**
 * @flow
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../common/colors';
import ImagePicker from 'react-native-image-crop-picker';
import map from 'lodash/map';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {isRTL} from '../../../app/common/locale';

export default class UploadImage extends Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    updateImage: PropTypes.func.isRequired,
  };

  pickImage = () => {
    const uploadedImages = this.props.images;
    const maxImages = 5;

    ImagePicker.openPicker({
      multiple: true,
    })
      .then(collection => {
        return map(collection, image => image.path);
      })
      .then(images => {
        if (uploadedImages.length >= maxImages) return;
        let allowedImages = [];
        let i = 1;
        images.forEach(image => {
          if (i + uploadedImages.length <= maxImages) {
            allowedImages.push(image);
          }
          i++;
        });
        return allowedImages;
      })
      .then(pendingImages => this.props.updateImage(pendingImages))
      .catch(e => {});
  };

  removeImage = removedImage => {
    this.props.updateImage(removedImage);
  };

  renderRow = ({item, index}) => {
    return (
      <View style={styles.row} key={index}>
        <TouchableHighlight
          onPress={() => this.removeImage(item)}
          underlayColor="transparent"
          style={{
            position: 'absolute',
            zIndex: 1000,
            top: -15,
            left: -5,
          }}
          hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}>
          <Ionicons
            name="ios-close"
            style={{
              backgroundColor: 'transparent',
            }}
            color="red"
            size={30}
          />
        </TouchableHighlight>
        <Image key={index} source={{uri: item}} style={styles.image} />
      </View>
    );
  };

  render() {
    const {images, header, footer} = this.props;

    return (
      <View style={styles.container}>
        {header}

        <TouchableHighlight
          style={styles.cameraIcon}
          onPress={() => this.pickImage()}
          underlayColor="transparent">
          <FontAwesome name="camera" size={100} color="white" />
        </TouchableHighlight>

        <View style={styles.menuContainer}>
          <FlatList
            data={images}
            contentContainerStyle={styles.contentContainer}
            style={styles.listStyle}
            enableEmptySections={true}
            renderItem={this.renderRow}
            automaticallyAdjustContentInsets={false}
            showsVerticalScrollIndicator={false}
            contentInset={{bottom: 50}}
            numColumns={3}
          />
        </View>

        {images.length > 0 && footer}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  contentContainer: {
    justifyContent: 'center',
  },
  listStyle: {
    margin: 5,
  },
  menuContainer: {
    flex: 3,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  row: {
    justifyContent: 'center',
    padding: 10,
    margin: 10,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#CCC',
  },
  cameraIcon: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 20,
  },
  image: {
    flex: 1,
    backgroundColor: 'gray',
    height: 80,
    width: 80,
  },
});
