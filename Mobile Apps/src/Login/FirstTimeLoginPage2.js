import React, {Component} from 'react';
import { StyleSheet, KeyboardAvoidingView, Text, View, Alert, TextInput, TouchableOpacity, BackHandler} from 'react-native';
import styles from './Styles'
import * as firebase from 'firebase'
import {getUserDetails} from '../components/RealTimeDatabase'
import {updateDetail, updateAuthDetail} from '../components/RealTimeDatabase'

class Page1 extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props){
    super(props);
    this.state ={carPlate:''}

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    this.setState({carPlate:''})
    //this.authOrUser()
    })
  }

  authOrUser = async() =>{
    var user = firebase.auth().currentUser;
    const details = await getUserDetails(user.uid)
    this.setState({authority:details.authority})
    setTimeout(() => {console.log(this.state.authority)}, 300)
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate("Pg1")
    return true
	//return false
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  _doneSetName= async() => {
    var user = firebase.auth().currentUser;
    const ready = await updateDetail('carPlate', this.state.carPlate.toUpperCase(), user.uid)
		console.log(this.state.carPlate)
  //  const ready = await updateAuthDetail('carPlate', `${this.state.carPlate.toUpperCase()}`, user.uid)
    this.setState({error:' ', loading:' '})
  //  if (this.state.authority === false){
  //    this.props.navigation.navigate("Pg2")
  //  }else{
      this.props.navigation.navigate("Pg3")
//    }
  }

  onNamePress(){
    this.setState({error:' ', loading:'loading'})
    this._doneSetName()
  }

  onLogOutPress(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("signout")
    })
    this.props.navigation.navigate("Login")
  }

  _touchfirstname  = () => {
      this.setState({position: -270})
  }

  _touchlastname  = () => {
      this.setState({position: -100})
  }

  render() {

    return (
      <View style={styles.container}>
      <KeyboardAvoidingView behavior='position' enabled keyboardVerticalOffset ={this.state.position}>
      <View style={{
        alignItems: 'center',
        justifyContent: 'flex-start',marginTop:15, marginBottom:75,paddingTop:0}}>
        <Text style={{color:'#1c313a'}}>Welcome!</Text>
        <Text style={{color:'#1c313a'}}>Please setup your profile</Text>
        <Text style={{color:'#1c313a'}}>You are few steps away from success</Text>
      </View>

      <View style={{
        alignItems: 'flex-start',
        justifyContent: 'center'}}>
        <Text style={styles.textContainer}>
          Car Plate
        </Text>
        <TextInput style={styles.inputContainer}

          underlineColorAndroid = 'rgba(0,0,0,0)'
          value ={this.state.carPlate.toUpperCase()}
          onChangeText={carPlate => this.setState({carPlate})}
          onTouchStart ={()=> {this._touchfirstname()}}
          placeholder='QMF 1234'
          placeholderTextColor = 'rgba(255,255,255,0.6)'/>

      </View>

      <View style = {{alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.loadingOrError}>{this.state.error}</Text>
      <Text style={styles.loadingOrError}>{this.state.loading}</Text>
      </View>

      <View style = {{alignItems: 'center', justifyContent: 'center',marginTop: 5}}>
        <TouchableOpacity
            style={styles.loginButton}
            onPress={this.onNamePress.bind(this)}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

        <View style = {{alignItems: 'center', justifyContent: 'flex-end', marginBottom:10, flex:1}}>
          <TouchableOpacity   onPress={this.onLogOutPress.bind(this)}>
            <Text style={styles.signUpButtonText}>Log in with another account</Text>
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default Page1;
