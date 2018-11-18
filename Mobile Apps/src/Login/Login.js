import React, {Component} from 'react';
import { StyleSheet, KeyboardAvoidingView, Text, View, Alert, TextInput, TouchableOpacity, BackHandler} from 'react-native';
import * as firebase from 'firebase'

import styles from './Styles'
import Logo from './Logo'
import {getUserDetails} from '../components/RealTimeDatabase'

class Login extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props){
    super(props);
    this.state ={email:'', password:'',error:' ', loading:' ', position:0}

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    this.setState({email:'', password:'', loading:' ', error: ' '})
    })
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>{
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      this.setState({loading:' ', error: ' '})
    }
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


  onLoginPress(){
    this.setState({error:' ', loading:'loading'})

    const{email, password} = this.state
    firebase.auth().signInWithEmailAndPassword(email,password)
    .then (() => {
      this.onCheckLoginStatus()
    })
    .catch (() =>{
      this.setState({error:'Authentication failed', loading:' '})
      Alert.alert("Authentication failed", "Wrong email or password");
    })
  }

  onWLLoginPress(){
    this.setState({error:' ', loading:'loading'})

    const email = 'liewwei.li07@gmail.com'
    password = '123456'
    firebase.auth().signInWithEmailAndPassword(email,password)
    .then (() => {
      this.onCheckLoginStatus()
    })
    .catch (() =>{
      this.setState({error:'Authentication failed', loading:' '})
      Alert.alert("Authentication failed", "Wrong email or password");
    })
  }

  onCheckLoginStatus =async() =>{
    var user = firebase.auth().currentUser;

    if (user != null) {
      var details= await getUserDetails(user.uid)
      if (user.emailVerified === true){
        if (details.authority == true){
          this.props.navigation.navigate("AuthorityHome")
        }else{
          this.props.navigation.navigate("Home")
        }
      }else{
        if (details.gender!='Male' && details.gender!='Female'){
          if (user.displayName == null){
          //  if (details.authority == 'undefined'){
          //    this.props.navigation.navigate("AuthorityOrUser")
          //  }else{
            this.props.navigation.navigate("Pg1")
          //  }
          }else{
            this.props.navigation.navigate("Pg2")
          }
        }else{
          this.props.navigation.navigate("Pg3")
        }
      }
    }else{
        this.onCheckLoginStatus()
    }
  }

  _touchemail  = () => {
      this.setState({position: -220})
  }

  _touchpassword  = () => {
      this.setState({position: -130})
  }

  render() {
    return (
      <View style={styles.container}>
      <KeyboardAvoidingView behavior='position' enabled keyboardVerticalOffset ={this.state.position}>
        <View style={{
          justifyContent: 'flex-start',marginTop:55, marginBottom:0,paddingTop:0}}>
          <Logo/>
        </View>

        <View style={{
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginTop:25,}}>
          <Text style={styles.textContainer}>
            Email
            </Text>
          <TextInput style={styles.inputContainer}
            underlineColorAndroid = 'rgba(0,0,0,0)'
            value ={this.state.email}
            onChangeText={email => this.setState({email})}
            onTouchStart ={()=> {this._touchemail()}}
            placeholder='example@gmail.com'
            placeholderTextColor = 'rgba(255,255,255,0.6)'/>

          <Text style={styles.textContainer}>
            Password
            </Text>
          <TextInput style={styles.inputContainer}
            underlineColorAndroid = 'rgba(0,0,0,0)'
            value ={this.state.password}
            onTouchStart ={()=> {this._touchpassword()}}
            secureTextEntry
            placeholder='*******'
            placeholderTextColor = 'rgba(255,255,255,0.6)'
            onChangeText={password => this.setState({password})}/>

        </View>

        <View style = {{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.loadingOrError}>{this.state.error}</Text>
        <Text style={styles.loadingOrError}>{this.state.loading}</Text>
        </View>

        <View style = {{alignItems: 'center', justifyContent: 'center',marginTop: 0}}>
          <TouchableOpacity
              style={styles.loginButton}
              onPress={this.onLoginPress.bind(this)}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>



        <View style = {{alignItems: 'center', justifyContent: 'flex-end',flex: 1, marginBottom: 10}}>
          <Text style={styles.word}>Do not have account yet?</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("SignUp")}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default Login;
