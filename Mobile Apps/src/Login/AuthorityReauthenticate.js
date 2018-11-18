import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, TextInput, TouchableOpacity, BackHandler} from 'react-native';
import * as firebase from 'firebase'

import styles from './Styles'
import Logo from './Logo'

class Reauthenticate extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;


  constructor(props){
    super(props);
    this.state ={email:'', newEmail:'', password:'',error:'', loading:'',newPassword:'', verifyPassword:'', action:this.props.navigation.state.params.action}
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
    this.props.navigation.navigate("AuthorityProfile")
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }


  reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
        user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  onConfirmPress(){
    const{email, password} = this.state
    console.log("d")
    this.setState({error:'', loading:'loading'})
    if (this.state.action == 'Delete Account')
    {
        this.reauthenticate(password).then(() => {
          console.log("check")
          var user = firebase.auth().currentUser;
          user.delete().then(function() {
            firebase.auth().onAuthStateChanged(function(user) {
              if (!user) {
                console.log("user deleted")
              //  this.props.navigation.navigate("Login")
              }
            })
            // User deleted
              //Alert.alert("Account deleted", "Press ok to go back to login screen",[{text: 'OK', onPress: () => {this.props.navigation.navigate("Login")}}]);
          }).catch(function(error) {
            // An error happened.
          });
          this.setState({error:'', loading:''})
          this.props.navigation.navigate("Login")
      }).catch((error) => { console.log(error);
        this.setState({error:'Authentication failed', loading:''})
        Alert.alert("Authentication failed", "Wrong Password");
      });
    }

      if (this.state.action == 'Change Password')
      {
        this.reauthenticate(password).then(() => {
          console.log("check")
          if (this.state.newPassword == this.state.verifyPassword)
          {
            console.log("change pw")
            console.log("new pw:" + this.state.newPassword)
            var user = firebase.auth().currentUser;
            user.updatePassword(this.state.newPassword).then(() => {
              console.log("Password updated!");
              this.setState({error:'', loading:''})
              Alert.alert("Congratulation", "Password updated!");
              this.props.navigation.navigate("AuthorityProfile")
            }).catch((error) => { console.log(error);
              this.setState({error:'Authentication failed', loading:''})
            Alert.alert("Authentication failed", "The new password must be 6 characters long or more"); });
          }else
          {
            this.setState({error:'Authentication failed', loading:''})
            Alert.alert("New password not match", "Please Reenter Your New Password");
          }
        }).catch((error) => { console.log(error);
        this.setState({error:'Authentication failed', loading:''})
        Alert.alert("Authentication failed", "Wrong Password");
      });
    }

      if (this.state.action == 'Change Email')
      {
        this.reauthenticate(password).then(() => {
          var user = firebase.auth().currentUser;
          user.updateEmail(this.state.newEmail).then(() => {
          console.log("Email updated!");
          this.setState({error:'', loading:''})
          Alert.alert("Congratulation", "Email updated!");
          var details, name, gend
          details = user.displayName.split("_")
          name = details[0]
          gend = details[1]

          user.updateProfile({
          displayName: name
          }).then(function() {
            // Update successful.
            console.log("name updated")
            console.log(name)
            console.log(gend)
            user.sendEmailVerification().then(function() {
              // Email sent
              console.log("email sent")
              user.updateProfile({
              displayName: name + '_' + gend
              }).then(function() {
                // Update successful.
                console.log("name updated")
                console.log(name)
                console.log(gend)
              }).catch(function(error) {
                // An error happened.
                console.log("error")
              });
            }).catch(function(error) {
              // An error happened.
            });
          }).catch(function(error) {
            // An error happened.
            console.log("error")
          })
          this.setState({error:'', loading:''})
          this.props.navigation.navigate("Pg3",{verified: 'Not Verified', nextOrRefresh:'Refresh', email: user.email})
          }).catch((error) => { console.log(error);
            this.setState({error:'Authentication failed', loading:''})
            Alert.alert("Authentication failed", "Please provide a correct Email");});
        }).catch((error) => { console.log(error);
          this.setState({error:'Authentication failed', loading:''})
          Alert.alert("Authentication failed", "Wrong Password");
      });
    }
  }

  renderMode(){
    if (this.state.action == 'Delete Account')
    {
      return(
      <View style={{
        alignItems: 'center',
        justifyContent: 'flex-start',}}
      >

        <Text style={{
          alignItems: 'center',
          justifyContent: 'center'}}>
          Delete Account
          </Text>
      </View>
      )
    }

    if (this.state.action == 'Change Password')
    {
      return(
        <View style={{
          alignItems: 'flex-start',
          justifyContent: 'center'}}>

          <Text style={styles.textContainer}>
            New Password (Min 6 digit)
            </Text>
          <TextInput style={styles.inputContainer}
            value ={this.state.newPassword}
            underlineColorAndroid = 'rgba(0,0,0,0)'
            secureTextEntry
            placeholder='*******'
            placeholderTextColor = 'rgba(255,255,255,0.4)'
            onChangeText={newPassword => this.setState({newPassword})}/>

          <Text style={styles.textContainer}>
            Retype Password
            </Text>
          <TextInput style={styles.inputContainer}
            underlineColorAndroid = 'rgba(0,0,0,0)'
            value ={this.state.verifyPassword}
            secureTextEntry
            placeholder='*******'
            placeholderTextColor = 'rgba(255,255,255,0.4)'
            onChangeText={verifyPassword => this.setState({verifyPassword})}/>
        </View>
      )
    }

    if (this.state.action == 'Change Email')
    {
      return(
        <View style={{
          alignItems: 'flex-start',
          justifyContent: 'center'}}>

          <Text style={styles.textContainer}>
            New Email
            </Text>
          <TextInput style={styles.inputContainer}
            underlineColorAndroid = 'rgba(0,0,0,0)'
            value ={this.state.newEmail}
            onChangeText={newEmail => this.setState({newEmail})}
            placeholder='example@gmail.com'
            placeholderTextColor = 'rgba(255,255,255,0.4)'/>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop:55}}>

          <Text style={{
            alignItems: 'center',
            justifyContent: 'center'}}>
            Please Enter Your Password
            </Text>
          <Text style={{
            alignItems: 'center',
            justifyContent: 'center'}}>
            to Confirm Your Action
            </Text>
        </View>


        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop:30}}>
          <TextInput style={styles.inputContainer}
            underlineColorAndroid = 'rgba(0,0,0,0)'
            value ={this.state.password}
            secureTextEntry
            placeholder='*******'
            placeholderTextColor = 'rgba(255,255,255,0.4)'
            onChangeText={password => this.setState({password})}/>
        </View>

        {this.renderMode()}

        <Text style={styles.loadingOrError}>{this.state.error}</Text>
        <Text style={styles.loadingOrError}>{this.state.loading}</Text>

        <View style = {{alignItems: 'center', justifyContent: 'center',marginTop: 0}}>
          <TouchableOpacity
              style={styles.loginButton}
              onPress={this.onConfirmPress.bind(this)}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
        <View style = {{alignItems: 'center', justifyContent: 'center',marginTop: 15}}>
          <TouchableOpacity
              style={styles.loginButton}
              onPress={() => this.props.navigation.navigate("Profile")}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

export default Reauthenticate;
