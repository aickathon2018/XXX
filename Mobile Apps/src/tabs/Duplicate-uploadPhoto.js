import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, BackHandler } from 'react-native';
import styles from './styles'
import * as firebase from 'firebase'

import ChooseImageScreen from '../components/chooseImageScreen2'

class QRCode extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    tabBarLabel: "QRCODE",
    tabBarIcon: ({tintColor}) => (
      <Image
        source = {require('../icons/qr.png')}
        style = {{width:18, height:18, tintColor: tintColor}}>
      </Image>
    )
  }

    constructor(props){
      super(props);
      this.state ={gender:'' ,name:'', email:'',userid:''}

      this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      )
      this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      this.getUserDetails()
      )
    }

    componentDidMount() {
      this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      );
      console.log("start")
    }

    onBackButtonPressAndroid = () => {
      this.props.navigation.navigate("Home")
      return true
    };

    componentWillUnmount() {
      this._didFocusSubscription && this._didFocusSubscription.remove();
      this._willBlurSubscription && this._willBlurSubscription.remove();
      console.log("end")
    }

    getUserDetails(){
      console.log("update")
      var user = firebase.auth().currentUser;
      var details, name, gend, email, photoUrl, uid, emailVerified;

      if (user != null) {
        details = user.displayName.split("_")
        name = details[0]
        gend = details[1]
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                     // this value to authenticate with your backend server, if
                     // you have one. Use User.getToken() instead.
        console.log("Email Verified: " + emailVerified);
        console.log("  Provider-specific UID: " + uid);
        console.log("  Name: " + name);
        console.log("  Email: " + email);
        console.log("  Photo URL: " + photoUrl);
        console.log("  Gender: " + gend);
        this.setState({
          gender: gend,
          name: name,
          email:email,
          userid:uid})
      }
    }

    onLogOutPress(){
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("signout")
      })
      this.props.navigation.navigate("Login")
    }

    render() {
      return (
        <View style={styles.container}>
        <View>
          <Text>This is page 2</Text>
        </View>
        <Text>Hi</Text>
        <Text>User ID: {this.state.userid}</Text>
        <View style={{  justifyContent: 'flex-start', marginTop:0, paddingTop:0, marginBottom:0, paddingBottom:0}}>
  					<ChooseImageScreen userid={this.state.userid}/>
  				</View>
        </View>
      );

    }
}

export default QRCode;
