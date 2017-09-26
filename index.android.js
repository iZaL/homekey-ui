import React from 'react';
import { AppRegistry, StatusBar } from 'react-native';
import Root from './src/Root';

console.disableYellowBox = true;

AppRegistry.registerComponent('property', () => Root);
