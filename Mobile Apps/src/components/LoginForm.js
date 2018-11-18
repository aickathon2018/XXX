import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, TextInput, TouchableOpacity} from 'react-native';
import styles from '../tabs/styles'

class LoginForm extends React.Component {
  render() {
    return (
      <View style = {{alignItems: 'center',}}>
        <Text style={styles.textContainer}>
          Email
          </Text>
        <TextInput style={styles.inputContainer}
          underlineColorAndroid = 'rgba(0,0,0,0)'
          //value ={this.state.email}
          onChangeText={email => this.setState({email})}
          placeholder='example@gmail.com'
          placeholderTextColor = 'rgba(255,255,255,0.4)'/>
        <Text style={styles.textContainer}>
          Password
          </Text>
        <TextInput style={styles.inputContainer}
          underlineColorAndroid = 'rgba(0,0,0,0)'
          //value ={this.state.password}
          secureTextEntry
          placeholder='*******'
          placeholderTextColor = 'rgba(255,255,255,0.4)'
          onChangeText={password => this.setState({password})}/>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style = {{alignItems: 'center', justifyContent: 'flex-end',marginVertical:100,}}>
          <Text style={styles.word}>Dont have account yet?</Text>
        <TouchableOpacity>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
        </View>
      </View>
      );
    }
  }

export default LoginForm;
