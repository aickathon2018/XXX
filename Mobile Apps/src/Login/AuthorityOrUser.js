import React, {Component} from 'react';
import { StyleSheet, KeyboardAvoidingView, Text, View, Alert, TextInput, TouchableOpacity, BackHandler} from 'react-native';
import * as firebase from 'firebase'

import styles from './Styles'
import {updateDetail} from '../components/RealTimeDatabase'

class Login extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props){
    super(props);
    this.state ={authority:' '}

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    Alert.alert("Exit", "Press YES to exit",[{text: 'No'},{text: 'Yes', onPress: () => BackHandler.exitApp()}]);
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  onLogOutPress(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("signout")
    })
    this.props.navigation.navigate("Login")
  }

  _onAuthoritySet = async(authority) =>{
    this.setState({error:' ', loading:'loading'})
    var user = firebase.auth().currentUser;
    const ready = await updateDetail('authority', authority, user.uid)
    this.setState({error:' ', loading:' '})
    this.props.navigation.navigate("Pg1")
  }

  onAuthorityPress(){
    this._onAuthoritySet(true)
  }

  onUserPress(){
    this._onAuthoritySet(false)
  }

  render() {
    return (
        <View style={styles.container}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginTop:70,
          }}>
          <Text style={{color:'#1c313a'}}>Welcome!</Text>
          <Text style={{color:'#1c313a'}}>Please setup your profile</Text>
          <Text style={{color:'#1c313a'}}>You are few steps away from success</Text>
        </View>

        <View style={{
          alignItems: 'center',
          justifyContent: 'center', marginTop:90}}>
          <Text style={{color:'rgba(255,255,255,0.6)', marginBottom:0}}> I am a :</Text>
        </View>

        <View style = {{alignItems: 'center', justifyContent: 'center',marginTop: 0}}>
          <TouchableOpacity
                style={{backgroundColor:'rgba(255,255,255, 0.5)',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
                marginTop:20,
                padding:8,
                width: 90,}}
                onPress={this.onUserPress.bind(this)}>
            <Text style={styles.buttonText}>User</Text>
          </TouchableOpacity>
        </View>

        <View style = {{alignItems: 'center', justifyContent: 'center',marginTop: 20}}>
          <TouchableOpacity
              style={{backgroundColor:'#1c313a',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 15,
              marginTop:20,
              padding:8,
              width: 90,}}
              onPress={this.onAuthorityPress.bind(this)}>
            <Text style={styles.buttonText}>Authority</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.loadingOrError}>{this.state.loading}</Text>

        <View style = {{alignItems: 'center', justifyContent: 'flex-end',marginBottom:10, flex:1}}>
          <TouchableOpacity   onPress={this.onLogOutPress.bind(this)}>
            <Text style={styles.signUpButtonText}>Log in with another account</Text>
  					</TouchableOpacity>
  				</View>

        </View>
    );
  }
}

export default Login;
