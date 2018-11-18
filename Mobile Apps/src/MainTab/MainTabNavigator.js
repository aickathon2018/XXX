import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image } from 'react-native';
import { createTabNavigator } from 'react-navigation'


import Home from '../tabs/Home'
import Read from '../tabs/Page1'
import Shop from '../tabs/Page2'
import Profile from '../tabs/Profile'

var MainTabNavigator = createTabNavigator({
    Home: {screen: Home},
    Read: {screen: Read},
    Shop: {screen: Shop},
    Profile: {screen: Profile},
},{
  tabBarPosition: 'bottom',
  swipeEnabled: true,
  tabBarOptions:{
    activeTintColor: 'blue',
    inactiveTintColor: 'grey',
    showIcon: true,
    showLabel: true,
    style:{
      backgroundColor: 'white',
    },
    indicatorStyle:{
      height:0,
    },
    labelStyle:{
      fontSize: 7,
      padding:0,
      margin:0
    },
    iconStyle:{
      padding:0,
      margin:0
    },

    //tabStyle:{
    //  height:55,
    //},
    upperCaseLabel:false,
    headerMode: 'none'
  },
})

MainTabNavigator.navigationOptions = {
  //title: "Testing"
  headerVisable:false,
}

export default MainTabNavigator;
