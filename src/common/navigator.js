import React from 'react';
import PropertyHome from './../property/PropertyHome';
import PropertyLocationPicker from './../property/PropertyLocationPicker';
import Login from './../auth/Login';
import Register from './../auth/Register';
import Forgot from './../auth/Forgot';
import PropertyList from './../property/PropertyList';
import PropertyManager from './../property/PropertyManager';
import PropertyFilter from './../property/PropertyFilter';
import PropertyFavorites from './../property/PropertyFavorites';
import PropertyDetail from './../property/PropertyDetail';
import PropertyCreate from './../property/PropertyCreate';
import PropertyEdit from './../property/PropertyEdit';
import Settings from './../user/Settings';
import LanguageSelect from './../app/LanguageSelect';
import Profile from './../user/Profile';
import UserDetail from './../user/UserDetail';
import UserEdit from './../user/UserEdit';
import CountryList from './../user/CountryList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StackNavigator, TabNavigator} from 'react-navigation';
import colors from './colors';
import I18n from './../app/common/locale';
import Chat from '../user/Chat';
import ChatList from '../user/ChatList';
import ChatThread from '../user/ChatThread';
import CompanyList from './../company/CompanyList';
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Octicons from "react-native-vector-icons/Octicons";
import Foundation from "react-native-vector-icons/Foundation";

const AuthStack = StackNavigator(
  {
    LoginScreen: {screen:Login},
    Register: {screen: Register},
    Forgot: {screen: Forgot},
  },
  {
    navigationOptions: {
      cardStack: {
        gesturesEnabled: false,
      },
    },
  }
);

const PropertyTab = StackNavigator(
  {
    PropertyHomeScene: {
      screen: PropertyHome,
    },
    LocationSearch: {
      screen: PropertyLocationPicker,
    },
    PropertyListScene: {
      screen: PropertyList,
      navigationOptions: {
        title: I18n.t('properties'),
      },
    },
    PropertyDetailScene: {
      screen: PropertyDetail,
      navigationOptions: ({navigation}) => ({
        title: `${navigation.state.params.property.meta.title}`,
      }),
    },
    ProfileScene: {
      screen: Profile,
    },
    ChatScene: {screen: Chat},
    CountryListScene: {
      screen: CountryList,
      navigationOptions: {
        title: I18n.t('choose_country'),
      },
    },
  },
  {
    headerBackTitle: null,
    headerMode: 'screen',
    navigationOptions: ({navigation}) => ({
      headerTintColor: colors.primary,
      headerTitleStyle: {color: colors.black},
      headerTruncatedBackTitle: '',
    }),

    // initialRouteName: 'PropertyListScene',
  },
);

const FavoriteTab = StackNavigator(
  {
    FavoritesScene: {
      screen: PropertyFavorites,
      navigationOptions: {
        title: I18n.t('favorites'),
      },
    },
    PropertyDetailScene: {
      screen: PropertyDetail,
      navigationOptions: ({navigation}) => ({
        title: `${navigation.state.params.property.meta.title}`,
      }),
    },
    ProfileScene: {
      screen: Profile,
    },
    ChatScene: {screen: Chat},
  },
  {
    headerBackTitle: null,
    headerMode: 'screen',
    navigationOptions: ({navigation}) => ({
      headerTintColor: colors.primary,
      headerTitleStyle: {color: colors.black},
      headerTruncatedBackTitle: '',
    }),
  },
);

const CompanyTab = StackNavigator(
  {
    CompanyListScene: {
      screen: CompanyList,
      navigationOptions: {
        title: I18n.t('companies'),
      },
    },

    ProfileScene: {
      screen: Profile,
    },
    ChatScene: {screen: Chat},
    PropertyDetailScene: {
      screen: PropertyDetail,
      navigationOptions: ({navigation}) => ({
        title: `${navigation.state.params.property.meta.title}`,
      }),
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: ({navigation}) => ({
      headerTintColor: colors.primary,
      headerTitleStyle: {color: colors.black},
      headerTruncatedBackTitle: '',
    }),
  },
);

const SettingTab = StackNavigator(
  {
    SettingsScene: {
      screen: Settings,
      navigationOptions: {
        title: I18n.t('settings'),
      },
    },
    CountryListScene: {
      screen: CountryList,
      navigationOptions: {
        title: I18n.t('choose_country'),
      },
    },
    UserDetailScene: {
      screen: UserDetail,
      navigationOptions: {},
    },
    UserEditScene: {
      screen: UserEdit,
      navigationOptions: {},
    },
    PropertyManager: {
      screen: PropertyManager,
      navigationOptions: {
        title: I18n.t('manage_your_listings'),
      },
    },
    PropertyDetailScene: {
      screen: PropertyDetail,
      navigationOptions: ({navigation}) => ({
        title: `${navigation.state.params.property.meta.title}`,
      }),
    },
    PropertyEditScene: {
      screen: PropertyEdit,
    },
    ProfileScene: {
      screen: Profile,
    },
    LanguageSelectScene: {screen: LanguageSelect},
    ChatScene: {screen: Chat},
    ChatListScene: {screen: ChatList},
    ChatThreadScene: {screen: ChatThread},
    PropertyCreateScene: {
      screen: PropertyCreate,
      navigationOptions: {
        title: I18n.t('add_property'),
      },
    },
  },
  {
    headerBackTitle: null,
    headerMode: 'screen',
    navigationOptions: ({navigation}) => ({
      headerTintColor: colors.primary,
      headerTitleStyle: {color: colors.black},
      headerTruncatedBackTitle: '',
    }),
    // initialRouteName:'PropertyManager'
  },
);

const Tabs = TabNavigator(
  {
    PropertyTab: {
      screen: PropertyTab,
      navigationOptions: {
        tabBarLabel: I18n.t('home'),
        tabBarIcon: ({tintColor, focused}) => (
          <MaterialCommunityIcons
            name={'home'}
            size={33}
            style={{color: focused ? colors.primary : colors.darkGrey}}
          />
        ),
      },
    },
    FavoritesTab: {
      screen: FavoriteTab,
      navigationOptions: {
        tabBarLabel: I18n.t('favorites'),
        tabBarIcon: ({tintColor, focused}) => (
          <MaterialCommunityIcons
            name={'star'}
            size={33}
            style={{color: focused ? colors.primary : colors.darkGrey}}
          />
        ),
      },
    },
    CompanyTab: {
      screen: CompanyTab,
      navigationOptions: {
        tabBarLabel: I18n.t('companies'),
        tabBarIcon: ({tintColor, focused}) => (
          <Entypo
            name={'network'}
            size={28}
            style={{color: focused ? colors.primary : colors.darkGrey}}
          />
        ),
      },
    },
    SettingsTab: {
      screen: SettingTab,
      navigationOptions: {
        tabBarLabel: I18n.t('more'),
        tabBarIcon: ({tintColor, focused}) => (
          <MaterialCommunityIcons
            name={'settings'}
            size={30}
            style={{color: focused ? colors.primary : colors.darkGrey}}
          />
        ),
      },
    },
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: colors.primary,
      showLabel:false,
      tabStyle: {
      },
      style: {
        backgroundColor:'white',
      },
    },
    animationEnabled: false,
    swipeEnabled: false,
    lazy: true,
    navigationOptions: {
      cardStack: {
        gesturesEnabled: false,
      },
    },
    // initialRouteName: 'SettingsTab',
  },
);

export default (Navigator = StackNavigator(
  {
    Tabs: {screen: Tabs},
    PropertyFilter: {
      screen: PropertyFilter,
      navigationOptions: {
        cardStack: {
          gesturesEnabled: false,
        },
      },
    },
    Login: {screen: AuthStack},
  },
  {
    headerMode: 'none',
    mode: 'modal',
    swipeEnabled: false,
  },
));
