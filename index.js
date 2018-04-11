import React from 'react';
import { AppRegistry, StatusBar } from 'react-native';
import {Provider} from 'react-redux';
import Store from "./src/common/store";
import App from "./src/app/App";

StatusBar.setBarStyle('dark-content');
console.disableYellowBox = true;

const Root = () => {
  return (
    <Provider store={Store}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent('homekey', () => Root);
