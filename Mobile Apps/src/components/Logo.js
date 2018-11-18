import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image } from 'react-native';

import styles from '../Login/Styles'

class Logo extends React.Component {
  render() {
    return (
      <View style={styles.loginLogo}>
        <Image style = {{width:150, height:300}}
          source={require('../icons/SSC_Logo.png')}/>
        <Text style = {{alignItems:'center', fontSize:14, color:'rgba(255,255,255,0.5)'}}>Smart Shopping Complex</Text>
      </View>
    );
  }
}

export default Logo;
