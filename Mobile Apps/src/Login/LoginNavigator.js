import React from 'react';
import { createStackNavigator } from 'react-navigation'
import * as firebase from 'firebase'

import Login from './Login'
import SignUp from './SignUp'
import FirstTimeLogin from './FirstTimeLogin'
import Reauthenticate from './Reauthenticate'

var LoginNavigator = createStackNavigator({
  Login: {screen: Login},
  SignUp:{screen: SignUp},
  FirstTimeLogin: {screen: FirstTimeLogin},
  Reauthenticate: {screen: Reauthenticate},
},{
    navigationOptions:{
        header: null,
    }
})

export default LoginNavigator;
