import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, TextInput, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation'
import styles from './Styles'
import * as firebase from 'firebase'

import Page1 from './FirstTimeLoginPage1'
import Page2 from './FirstTimeLoginPage2'
import Page3 from './FirstTimeLoginPage3'

var FirstTimeLogin = createStackNavigator({
  Pg1: {screen: Page1},
  Pg2: {screen: Page2},
  Pg3: {screen: Page3},
},{
    headerBackTitleVisible: true,
    navigationOptions:{
        headerStyle:{
          backgroundColor:'#455a64',
        },
        headerTintColor:'#1c313a',
    }
})

export default FirstTimeLogin;
