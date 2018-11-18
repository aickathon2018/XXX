import React from 'react';
import { StyleSheet, View, BackHandler} from 'react-native';

import styles from './tabs/styles'
import Logo from './components/Logo'
import * as firebase from 'firebase'

import {getUserDetails} from './components/RealTimeDatabase'

class FirstScreen extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props){
    super(props);
    this.state ={timeoutCounter:''}

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
		BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    )

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
      var timeoutCounter=0
      this.setState({timeoutCounter: timeoutCounter})
      this.count = setInterval(this.onCheckLoginStatus.bind(this), 250);
    })
	}

	componentDidMount() {
		this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
			BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);

    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
		  clearInterval(this.count)
		);
	}

	onBackButtonPressAndroid = () => {
		console.log("back")
    BackHandler.exitApp()
		return true
	};

	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	}

  onCheckLoginStatus = async() => {
    console.log("check")
    var user = firebase.auth().currentUser;

    if (user != null) {
      var details= await getUserDetails(user.uid)
      if (user.emailVerified === true){
        if (details.authority == true){
          this.props.navigation.navigate("AuthorityHome")
        }else{
          this.props.navigation.navigate("Home")
        }
      }else{
        if (details.carPlate==null){
          if (user.displayName == null){
        //    if (details.authority == 'undefined'){
        //      this.props.navigation.navigate("AuthorityOrUser")
        //    }else{
            this.props.navigation.navigate("Pg1")
      //      }
          }else{
            this.props.navigation.navigate("Pg2")
          }
        }else{
          this.props.navigation.navigate("Pg3")
        }
      }
    }else{
      if (this.state.timeoutCounter < 15){
        this.setState({timeoutCounter: this.state.timeoutCounter +1})
        console.log(this.state.timeoutCounter)
      }else{
        this.props.navigation.navigate("Login")
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Logo/>
      </View>
    );
  }
}

export default FirstScreen;
