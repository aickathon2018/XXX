import React from "react";
import { StyleSheet, Text, View } from "react-native";

const { ChatManager, TokenProvider } = require('@pusher/chatkit')
const { JSDOM } = require('jsdom')
const axios = require('axios')

const instanceLocatorId = "v1:us1:b284e1d0-9b5a-4c45-9410-40871699445b";
const presenceRoomId = 19681526; // room ID of the general room created through the chatKit inspector

const tokenProvider = new TokenProvider({
  url: `https://us1.pusherplatform.io/services/chatkit_token_provider/v1/b284e1d0-9b5a-4c45-9410-40871699445b/token`
});

class Chat extends React.Component {
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
    this.state ={userid: 'czqy7bFKnFeEQezJMxMGLABuSDs2', authid: '8D7O6mJM9BZmtLKTZnymA5G0lyu2', title: '', messages: []}
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    )
  }

  initChat = async() => {
    var ready = await createUser(username)
  }

  createUser = async (username) => {
   try {
     await axios.post('http://localhost:3001/users', {username});
   } catch ({message}) {
     throw new Error(`Failed to create a user, ${message}`);
   }
 };

componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
    this.initChat
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate("Home")
    return true
  };

componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

onReceive(data) {
     const { id, senderId, text, createdAt } = data;
     const incomingMessage = {
       _id: id,
       text: text,
       createdAt: new Date(createdAt),
       user: {
         _id: senderId,
         name: senderId,
         avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmXGGuS_PrRhQt73sGzdZvnkQrPXvtA-9cjcPxJLhLo8rW-sVA"
       }
     };

     this.setState(previousState => ({
       messages: GiftedChat.append(previousState.messages, incomingMessage)
     }));
   }

  _sent= async()=>{
    console.log("sentttttt")
    var time = new Date().getTime()
    if (this.state.title!='')
    var ready = this._updateDetail(time, 'u')
  }

  _updateDetail = (time, userOrAuth) => {
    return new Promise ((resolve, reject)=>{
      firebase.database().ref('Chats/'+ this.state.userid+this.state.authid).update({
          [userOrAuth + ':' + time] : this.state.title
        }
      ).then(()=> {
        console.log("INSERTED")
        resolve(true)
      }).catch((error)=>{
      })
    })
  }

  onSend([message]) {
  this.currentUser.sendMessage({
    text: message.text,
    roomId: CHATKIT_ROOM_ID
  });
}

  render() {
    var chatkey = this.state.userid + this.state.authid

    return (
    <View>
    <Text> Hi </Text>
    </View>
  )}
}

export default Chat;
