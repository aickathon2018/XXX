import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image } from 'react-native';

import styles from './Styles'

class Logo extends React.Component {
  render() {
    return (
      <View style={styles.loginLogo}>
        <Image style = {{width:80 , height:140}}
          source={require('../icons/SSC_Logo.png')}/>
        <Text style = {styles.logoText}>Smart Shopping Complex</Text>
      </View>
    );
  }
}

export default Logo;
