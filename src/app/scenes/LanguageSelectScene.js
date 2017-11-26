import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import Separator from '../../components/Separator';
import colors from "../../common/colors";

const LanguageSelectScene = ({onLanguageSelect,selectedLanguage}) => {
  return (
    <View style={[styles.container]}>
      <TouchableHighlight
        onPress={() => onLanguageSelect('en')}
        style={styles.selectLanguageWrapper}
        underlayColor="transparent"
        activeOpacity={0.6}>
        <Text style={[styles.languageTitle, selectedLanguage && selectedLanguage === 'en' && styles.activeLanguage  ]}> English </Text>
      </TouchableHighlight>
      <Separator />
      <TouchableHighlight
        onPress={() => onLanguageSelect('ar')}
        style={styles.selectLanguageWrapper}
        underlayColor="transparent"
        activeOpacity={0.6}>
        <Text style={styles.languageTitle}> العربي </Text>
      </TouchableHighlight>
    </View>
  );
};

LanguageSelectScene.propTypes = {
  onLanguageSelect: PropTypes.func.isRequired,
  selectedLanguage:PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  selectLanguageWrapper: {
    flex: 1,
    justifyContent: 'space-around',
  },
  languageTitle: {
    color: 'black',
    fontWeight: '100',
    fontSize: 70,
    textAlign: 'center',
  },
  activeLanguage : {
    color:colors.primary
  }
});

export default LanguageSelectScene;
