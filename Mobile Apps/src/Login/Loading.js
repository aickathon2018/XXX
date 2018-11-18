import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, BackHandler, ActivityIndicator} from 'react-native';
import styles from './Styles'

class Loading extends React.Component {

  componentDidMount() {
    setTimeout(() => {this.props.navigation.goBack(null)}, 700)
  }

  render() {
    return (
      <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex:1, marginTop:0}}>
          <ActivityIndicator size = "large"/>
      </View>
    );
  }
}

export default Loading;
