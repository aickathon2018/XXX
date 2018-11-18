import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, BackHandler } from 'react-native';
import styles from './styles'
import * as firebase from 'firebase'

class Settings extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    tabBarLabel: "QRCODE",
    tabBarIcon: ({tintColor}) => (
      <Image
        source = {require('../icons/book.png')}
        style = {{width:18, height:18, tintColor: tintColor}}>
      </Image>
    )
  }

  constructor(props){
    super(props);
    this.state ={currentState: 'Page',}
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
  )
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate("Profile")
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  render() {
    return (
      <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex:1, marginTop:0}}>
        <Text>This is Setting</Text>
      </View>
    );
  }
}

export default Settings;
