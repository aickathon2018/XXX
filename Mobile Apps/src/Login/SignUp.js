import React from 'react';
import { StyleSheet, KeyboardAvoidingView, Text, View, Alert, TextInput, TouchableOpacity, BackHandler} from 'react-native';
import * as firebase from 'firebase'

import {initUser} from '../components/RealTimeDatabase'
import styles from './Styles'
import Logo from './Logo'

class Login extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props){
    super(props);
    this.state ={email:'', password:'', verifyPassword:'', error:' ', loading:' ', position: 0}

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    this.setState({email:'', password:'', verifyPassword:'', loading:' ', error: ' '})
    });
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate("Login")
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  _doneSignUp= async() => {
    var user = firebase.auth().currentUser;
    const details = {
      "userid" : user.uid,
      "email" : user.email,
    }
    const ready = await initUser(details)
    this.setState({error:' ', loading:' '})
    this.props.navigation.navigate("Pg1")
  }

  onSignUpPress() {
    this.setState({error:' ', loading:'Loading'})
    if (this.state.password == this.state.verifyPassword)
    {
      const{email, password} = this.state

      firebase.auth().createUserWithEmailAndPassword(email,password)
      .then (() => {
        this._doneSignUp()
      })
      .catch (() =>{
        this.setState({error:'Authentication failed', loading:' '})
        Alert.alert("Authentication failed", "Email already been used or password too short");
      })
    }
    else{
      this.setState({error:'Authentication failed', loading:' '})
      Alert.alert("Password not match", "Please reenter you password");
    }
  }

  _touchemail  = () => {
      this.setState({position: -270})
  }

  _touchpassword  = () => {
      this.setState({position: -190})
  }

  _touchretypepassword  = () => {
      this.setState({position: -100})
  }

  render() {
    return (
      <View style={styles.container}>
      <KeyboardAvoidingView behavior='position' enabled keyboardVerticalOffset ={this.state.position}>
        <View style={{
          justifyContent: 'flex-start',marginTop:10, marginBottom:0,paddingTop:0}}>
          <Logo/>
        </View>
        <View style={{
          alignItems: 'flex-start',
          justifyContent: 'center', marginTop:0}}>
          <Text style={styles.textContainer}>
            Email
          </Text>
          <TextInput style={styles.inputContainer}
            underlineColorAndroid = 'rgba(0,0,0,0)'
            onTouchStart ={()=> {this._touchemail()}}
            value ={this.state.email}
            onChangeText={email => this.setState({email})}
            placeholder='example@gmail.com'
            placeholderTextColor = 'rgba(255,255,255,0.6)'/>

          <Text style={styles.textContainer}>
            Password (Min 6 digit)
            </Text>
          <TextInput style={styles.inputContainer}
            value ={this.state.password}
            underlineColorAndroid = 'rgba(0,0,0,0)'
            onTouchStart ={()=> {this._touchpassword()}}
            secureTextEntry
            placeholder='*******'
            placeholderTextColor = 'rgba(255,255,255,0.6)'
            onChangeText={password => this.setState({password})}/>

          <Text style={styles.textContainer}>
            Retype Password
            </Text>
          <TextInput style={styles.inputContainer}
            underlineColorAndroid = 'rgba(0,0,0,0)'
            value ={this.state.verifyPassword}
            onTouchStart ={()=> {this._touchretypepassword()}}
            secureTextEntry
            placeholder='*******'
            placeholderTextColor = 'rgba(255,255,255,0.6)'
            onChangeText={verifyPassword => this.setState({verifyPassword})}/>
        </View>

        <View style = {{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.loadingOrError}>{this.state.error}</Text>
        <Text style={styles.loadingOrError}>{this.state.loading}</Text>
        </View>

        <View style = {{alignItems: 'center', justifyContent: 'center',marginTop: 0}}>
          <TouchableOpacity
            onPress={this.onSignUpPress.bind(this)}
            style={styles.loginButton}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          </View>

        <View style = {{alignItems: 'center', justifyContent: 'flex-end', flex:1, marginBottom:10}}>
          <Text style={styles.word}>Already have account?</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")}>
            <Text style={styles.signUpButtonText}>Log in</Text>
        </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default Login;
