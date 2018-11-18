import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, TextInput, TouchableOpacity, Picker, BackHandler} from 'react-native';
import styles from './Styles'
import * as firebase from 'firebase'
import {getUserDetails} from '../components/RealTimeDatabase'

class Page3 extends React.Component {

  _didFocusSubscription;
	_willBlurSubscription;

  constructor(props){
    super(props);
    this.state ={
      verified:'',
      email:' ',
      error:' ',
      loading:' ',
      nextOrRefresh:' '}

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
		BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    )

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
      this.updateState()
      this.count = setInterval(this.updateState.bind(this), 1000);
      })
	}

	componentDidMount() {
    this.updateState()
    var user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function() {
      // Email sent
      console.log("email sent")
      }).catch(function(error) {
        // An error happened.
      })
		this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>{
			BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      clearInterval(this.count)
      this.authOrUser()
    });
	}

  authOrUser = async() =>{
    var user = firebase.auth().currentUser;
    const details = await getUserDetails(user.uid)
    this.setState({authority:details.authority})
    setTimeout(() => {console.log(this.state.authority)}, 300)
  }

	onBackButtonPressAndroid = () => {
  //  if (this.state.authority === false){
      this.props.navigation.navigate("Pg2")
  //  }else{
  //    this.props.navigation.navigate("Pg1")
  //  }
		return true
	};

	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	}

  onVerifyEmailPress(){
    this.setState({error:' ', loading:'loading'})
      var user = firebase.auth().currentUser;

      user.sendEmailVerification().then(function() {
        // Email sent
        console.log("email sent")
        }).catch(function(error) {
          // An error happened.
        })
      this.setState({error:' ', loading:'Email Resent'})
    }

  onNextPress(){
    firebase.auth().currentUser.reload()
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    this.setState({error:' ', loading:'loading'})

    if (user != null) {
      name = user.displayName
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                   // this value to authenticate with your backend server, if
                   // you have one. Use User.getToken() instead.
      console.log("  Email Verified: " + emailVerified);
      console.log("  Provider-specific UID: " + uid);
      console.log("  Name: " + name);
      console.log("  Email: " + email);
      console.log("  Photo URL: " + photoUrl);
    }

    if(this.state.nextOrRefresh=='Next'){
        this.setState({error:' ', loading:' '})
        if (this.state.authority === true){
          this.props.navigation.navigate("AuthorityHome")
        }else{
          this.props.navigation.navigate("Home")
        }
    }else{
        console.log("Refresh")
    }

    if (emailVerified === true){
      console.log("Next")
      this.setState({
        verified: 'Verified',
        nextOrRefresh: 'Next',
        error:' ',
        loading:' ',
      })
    }else{
      console.log("Not Verified")
      this.setState({
        verified: 'Not Verified',
        nextOrRefresh: 'Refresh',
        error:' ',
        loading:' ',
      })
    }
  }

  updateState(){
    firebase.auth().currentUser.reload()
    var user = firebase.auth().currentUser;
    this.setState({email:user.email})
    if (user.emailVerified === true){
      if (this.state.verified != 'Verified'){
        this.setState({
        verified: 'Verified',
        nextOrRefresh: 'Next',
        error:' ',
        loading:' ',
      })
      }
    }else{
      if (this.state.verified != 'Not Verified'){
        this.setState({
          verified: 'Not Verified',
          nextOrRefresh: 'Refresh',
          error:' ',
          loading:' ',
        })
      }
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

    console.log(this.state.verified)
    return (
      <View style={styles.container}>
      <View style={{
        alignItems: 'center',
        justifyContent: 'flex-start',marginTop:20, marginBottom:30,}}>
        <Text style={{color:'#1c313a'}}>Welcome!</Text>
        <Text style={{color:'#1c313a'}}>Please setup your profile</Text>
        <Text style={{color:'#1c313a'}}>You are few steps away from success</Text>
      </View>

      <View style={{
        alignItems: 'center',
        justifyContent: 'center', marginBottom:0}}>
        <Text style={{color:'rgba(255,255,255,0.6)', marginBottom:0}}> Verification email has been sent to</Text>
        <Text style={{color:'rgba(255,255,255,0.6)', marginBottom:30}}> {this.state.email}</Text>
        <Text style={{color:'rgba(255,255,255,0.6)', fontSize:18}}> Status: </Text>
        <Text style={{color:'rgba(255,255,255,0.6)', fontSize:25}}>{this.state.verified}</Text>
        <Text style = {{marginTop:40, color:'#1c313a'}}> Press for resent the email</Text>
      </View>

      <Text style={styles.loadingOrError}>{this.state.error}</Text>
      <Text style={styles.loadingOrError}>{this.state.loading}</Text>

      <View style = {{alignItems: 'center', justifyContent: 'center',marginTop: 0}}>
        <TouchableOpacity
              style={{backgroundColor:'#1c313a',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 15,
              marginTop:10,
              padding:8,
              width: 90,}}
            onPress={this.onVerifyEmailPress.bind(this)}>
          <Text style={styles.buttonText}>Resent</Text>
        </TouchableOpacity>
      </View>

      <View style = {{alignItems: 'center', justifyContent: 'center',marginTop: 15}}>
        <TouchableOpacity
            style={styles.loginButton}
            onPress={this.onNextPress.bind(this)}>
          <Text style={styles.buttonText}>{this.state.nextOrRefresh}</Text>
        </TouchableOpacity>
      </View>

      <View style = {{alignItems: 'center', justifyContent: 'flex-end',marginBottom:10, flex:1}}>
        <TouchableOpacity   onPress={this.onLogOutPress.bind(this)}>
          <Text style={styles.signUpButtonText}>Log in with another account</Text>
					</TouchableOpacity>
				</View>

      </View>

    );
  }
}

export default Page3;
