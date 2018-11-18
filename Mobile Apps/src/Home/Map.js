import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, BackHandler } from 'react-native';
import styles from '../tabs/styles'
import * as firebase from 'firebase'
import PinLocation from './PinLocation';


class Map extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;


  constructor(props){
    super(props);
    this.state ={currentState: 'Page',}
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
    this.props.navigation.navigate("Report")
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  onOkPress=(Markerlatitude, Markerlongitude, addressComponent)=>{
  //  this.props.navigation.navigate('Report')
      this.props.navigation.navigate("Report",{Markerlatitude, Markerlongitude, addressComponent})
  }


  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <PinLocation onOkPress={this.onOkPress}/>
      </View>
    );
  }
}

export default Map;
