import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, BackHandler } from 'react-native';
import styles from './styles'
import * as firebase from 'firebase'
import {getUserDetails, getOrderDetails} from '../components/RealTimeDatabase'

class Cart extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    tabBarLabel: "Read",
    tabBarIcon: ({tintColor}) => (
      <Image
        source = {require('../icons/book.png')}
        style = {{width:18, height:18, tintColor: tintColor}}>
      </Image>
    )
  }

  constructor(props){
    super(props);
    this.state ={currentState: 'Cart',orders:[]}
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    this._updateDetails()}
  )
  }

  _updateDetails=async()=>{
    var user = firebase.auth().currentUser;
    var detail=await getUserDetails(user.uid)
    console.log(detail.cart.key)

  }

  getOrderDet = async(orderArray)=>{
    const order = await getOrderDetails(orderArray)
    //console.log(order)
    this.setState({orders:order, dataReady:true})
    console.log(order)
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate("Home")
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>This is page 1</Text>
      </View>
    );
  }
}

export default Cart;
