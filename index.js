import React from 'react';
import { AppRegistry, StatusBar } from 'react-native';
import {Provider} from 'react-redux';
import Store from "./src/common/store";
import App from "./src/app/App";
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import colors from "./src/common/colors";

StatusBar.setBarStyle('dark-content');
console.disableYellowBox = true;

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
  },
};

const Root = () => {
  return (
    <Provider store={Store}>
      <PaperProvider theme={theme}>
        <App/>
      </PaperProvider>
    </Provider>
  );
};

AppRegistry.registerComponent('homekey', () => Root);
