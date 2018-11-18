import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, BackHandler } from 'react-native';
import styles from './styles'
import * as firebase from 'firebase'

class Page1 extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    tabBarLabel: "Nearby",
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
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    })
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate("Home")
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  _click = async() => {
    //console.log(this.state.name)
    //const id = await searchAuth(this.state.name)
    //this.props.navigation.navigate('Search', id);
  //  console.log(userid)
    //const ready = await onFollowPress(user.uid, this.state.followid)
  //  Alert.alert("Account deleted", "Press ok to go back to login screen",[{text: 'OK', onPress: () => {this.props.navigation.navigate("SignUp")}}]);
   Alert.alert("hello", "notification")
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>This is page 1</Text>
        <View style={{justifyContent: 'center',alignItems: 'center', marginTop: 70}}>
          <Text>Hello</Text>
          <Text style={{color:'#ffffff', fontSize:18}}>This is page 1</Text>
          <Text> </Text>
        </View>
      </View>
    );
  }
}

export default Page1;
