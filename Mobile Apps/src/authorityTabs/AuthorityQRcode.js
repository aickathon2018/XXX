'use strict';

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Alert, Image, BackHandler,  TouchableOpacity, } from 'react-native';

import * as firebase from 'firebase'
import QRCodeScanner from 'react-native-qrcode-scanner';
import {getUserDetails} from '../components/RealTimeDatabase'

import {QRCode} from 'react-native-custom-qr-codes'

class AuthorityQRCode extends React.Component {
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
    this.state ={
      userid: '',
      dataqr: '',
      status: 'Ready',
      ready: false,
    }
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    var user = firebase.auth().currentUser;
    this.setState({ready: true, userid:user.uid})
    })
  }

  _onLearnMore = async(userid) =>{
    const user = await getUserDetails(userid)
    this.props.navigation.navigate('Details', { ...user , previousScreen:'QRCode', userid});
  }

  onSuccess(e) {
   this._onLearnMore(e.data)
 }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
    {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      this.setState({ready: false})
    }
    );
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate("AuthorityHome")
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  render() {
    const scan = this.state.ready?(
        <QRCodeScanner
        onRead={this.onSuccess.bind(this)}
        topContent={
          <Text style={styles.centerText}>
            Please scan the <Text style={styles.textBold}>QR_code</Text> to find the authority
          </Text>
        }
        bottomContent={
            <Text style={styles.centerText}>QR Code can be found on Profile=>Username </Text>
        }
      />
    ):(<Text> </Text>)

    const qr = this.state.ready?(
      <View>
      <QRCode content={this.state.userid} backgroundImage={require('../icons/galaxy2.jpg')} codeStyle='circle'/>
      <Text style={{marginTop:5, textAlign:'center'}}>Please scan to find Me!!</Text>
      </View>
    ):(<Text> </Text>)

    return (
      <View style={{flex:1, backgroundColor: 'transparent', justifyContent:'center', alignSelf:'center', alignItems:'center'}}>
          {qr}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});


export default AuthorityQRCode;
