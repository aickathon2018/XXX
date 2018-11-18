import React from 'react';
import * as firebase from 'firebase'
import { StyleSheet, Text, View, Button, Alert, Image, BackHandler , TouchableOpacity} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';
import Backend from './Backend';

export default class Chat extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props){
    super(props);
    this.state ={userid: 'czqy7bFKnFeEQezJMxMGLABuSDs2', authid: '8D7O6mJM9BZmtLKTZnymA5G0lyu2', name:'wei li', title: '', messages: []}
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    )
  }

  componentDidMount() {
    Backend.loadMessages((message) => {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, message),
        };
      });
    },this.state.userid+this.state.authid);
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate("Home")
    return true
  };

  componentWillUnmount() {
    Backend.closeChat();
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(message) => {
          Backend.sendMessage(message);
        }}
        user={{
          _id: this.state.userid,
          name: this.state.name,
        }}
      />
    );
  }
}
