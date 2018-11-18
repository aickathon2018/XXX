import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, BackHandler , TouchableOpacity} from 'react-native';
import styles from '../tabs/styles'
import * as firebase from 'firebase'

import Chatkit from "@pusher/chatkit";
import { GiftedChat } from 'react-native-gifted-chat'
import {Icon, FormInput, FormLabel, FormValidationMessage, ListItem, List, Badge} from 'react-native-elements';

const CHATKIT_TOKEN_PROVIDER_ENDPOINT = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/b284e1d0-9b5a-4c45-9410-40871699445b/token"
const CHATKIT_INSTANCE_LOCATOR = "v1:us1:b284e1d0-9b5a-4c45-9410-40871699445b";
const CHATKIT_KEY = "fc1ead85-da89-4bae-8acf-64b44a27fb9a:7QwTWunj2TLWVdcof2rAlC/c4Tj2yxFUBHfCZlo2gFk=";
const CHATKIT_ROOM_ID = 19681526;
const CHATKIT_USER_NAME = "Charis"; // Let's chat as "Dave" for this tutorial



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

  initChat (){
    console.log("init1")
    var user = firebase.auth().currentUser
    var chatArray=[];
    UserReportRef=firebase.database().ref('/Chats/'+this.state.userid+this.state.authid)
    GetReportKey= UserReportRef.once("value",(snapshot)=>{
      snapshot.forEach((child)=>{
        console.log(child.key)
        console.log(child.val())
        chatArray.push(child.key)
      })
    })
  }

  initChat2= async() => {
      //var ready = await this._createUser()
      console.log("hi")
    }

/*
  _createUser(){
    return new Promise ((resolve, reject)=>{

        const chatkit = new Chatkit.default({
        instanceLocator: "v1:us1:b284e1d0-9b5a-4c45-9410-40871699445b",
        key: 'fc1ead85-da89-4bae-8acf-64b44a27fb9a:7QwTWunj2TLWVdcof2rAlC/c4Tj2yxFUBHfCZlo2gFk=',
      })

      chatkit.createUser({
          id: 'zz',
          name: 'zz',
        })
          .then(() => {
            console.log('User created successfully');
            resolve(true)
          }).catch((err) => {
            console.log(err);
      });
    })
  }
*/
  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );

    const chatkit = new Chatkit.default({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      key: CHATKIT_KEY,
    })

    chatkit.createUser({
      id: "bookercodes",
      name: "Alex Booker"
    })

    //this.initChat2()
    // This will create a `tokenProvider` object. This object will be later used to make a Chatkit Manager instance.
    /*   const tokenProvider = new Chatkit.TokenProvider({
         url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
       });

       // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
       // For the purpose of this example we will use single room-user pair.
       const chatManager = new Chatkit.ChatManager({
         instanceLocator: CHATKIT_INSTANCE_LOCATOR,
         userId: CHATKIT_USER_NAME,
         tokenProvider: tokenProvider
       });

       // In order to subscribe to the messages this user is receiving in this room, we need to `connect()` the `chatManager` and have a hook on `onNewMessage`. There are several other hooks that you can use for various scenarios. A comprehensive list can be found [here](https://docs.pusher.com/chatkit/reference/javascript#connection-hooks).
       chatManager.connect().then(currentUser => {
         this.currentUser = currentUser;
         this.currentUser.subscribeToRoom({
           roomId: CHATKIT_ROOM_ID,
           hooks: {
             onNewMessage: this.onReceive.bind(this)
           }
         });
       });*/
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
    //const {userid, authid} = this.props.navigation.state.params;
    return (
      <GiftedChat messages={this.state.messages}
      onSend={messages => this.onSend(messages)}
        user={{
        _id: CHATKIT_USER_NAME
      }}/>
    );
  }
}

/*
<View style={styles.container}>

<Text>chatkey:{chatkey}</Text>

<FormInput

  inputStyle={{color:'#1c313a', marginLeft:0, marginRight:0, paddingLeft:10, paddingRight:35}}
  multiline={true}
  numberOfLines = {2}
  maxLength = {50}
  placeholder='Click to Add Title'
  placeholderTextColor = 'grey'
  underlineColorAndroid = 'rgba(0,0,0,0)'
  onChangeText={title => this.setState({title})}
  />

  <TouchableOpacity
      style={{width:65, height:35, marginTop: 10, borderRadius: 15, marginLeft:0, backgroundColor: 'rgba(255,119,26,0.85)', alignItems:'center' , justifyContent:'center'}}
      onPress={()=> this._sent()}
  >
      <Text style={{color:'rgba(255,255,255,0.7)'}}>Sent</Text>
  </TouchableOpacity>

</View>

*/
export default Chat;
