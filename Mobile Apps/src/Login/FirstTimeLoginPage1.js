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
    this.state ={firstName:'', surname:'',error:' ', loading:' ', position:0, authority: ''}

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    this.setState({firstName:'', surname:''})
    this.authOrUser()
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
  //  this.props.navigation.navigate("AuthorityOrUser")
  //  return true
  //return false
  Alert.alert("Exit", "Press YES to exit",[{text: 'No'},{text: 'Yes', onPress: () => BackHandler.exitApp()}]);
  return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  _doneSetName= async() => {
    var user = firebase.auth().currentUser;
    const ready = await updateDetail('name', this.state.firstName + ' ' + this.state.surname, user.uid)
    const ready2 = await updateAuthDetail('Name', `${this.state.firstName.toUpperCase()}` + ' ' + `${this.state.surname.toUpperCase()}`, user.uid)
    const ready3 = await updateDetail('authority', false, user.uid)
    this.setState({error:' ', loading:' '})
  //  if (this.state.authority === false){
  //    this.props.navigation.navigate("Pg2")
  //  }else{
      this.props.navigation.navigate("Pg2")
//    }
  }

  onNamePress(){
    this.setState({error:' ', loading:'loading'})
    var user = firebase.auth().currentUser;
    const{firstName, surname} = this.state

      if (firstName != null && surname != null && firstName != '' && surname!= ''){
        user.updateProfile({
        displayName: firstName + ' ' + surname,
        }).then(function() {
          // Update successful.
        }).catch(function(error) {
          // An error happened.
        });
        this._doneSetName()
      }else {
        this.setState({error:'Authentication failed', loading:' '})
      }
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
          First Name
        </Text>
        <TextInput style={styles.inputContainer}

          underlineColorAndroid = 'rgba(0,0,0,0)'
          value ={this.state.firstName}
          onChangeText={firstName => this.setState({firstName})}
          onTouchStart ={()=> {this._touchfirstname()}}
          placeholder='First Name'
          placeholderTextColor = 'rgba(255,255,255,0.6)'/>

        <Text style={styles.textContainer}>
          Surname
        </Text>
        <TextInput style={styles.inputContainer}
          underlineColorAndroid = 'rgba(0,0,0,0)'
          value ={this.state.surname}
          onTouchStart ={()=> {this._touchlastname()}}
          onChangeText={surname => this.setState({surname})}
          placeholder='Surname'
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
