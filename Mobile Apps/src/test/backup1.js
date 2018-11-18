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
/*    UserReportRef=firebase.database().ref('/Chats/'+this.state.userid+this.state.authid)
    GetReportKey= UserReportRef.once("value",(snapshot)=>{
      snapshot.forEach((child)=>{
        console.log(child.key)
        console.log(child.val())
        chatArray.push(child.key)
      })
    })*/

    var commentsRef = firebase.database().ref('/Chats/' + this.state.userid+this.state.authid);
    commentsRef.on('child_added', (snapshot) => {
  //    this.testing('u', snapshot.key.split(":")[1], snapshot.val(), 1540740849207)
      this.onReceive('u', snapshot.key.split(":")[1], snapshot.val(), 1540740849207)
      console.log(snapshot.key.split(":")[1])
      console.log(snapshot.key.split(":")[0])
      console.log(snapshot.val())
    })

}

  testing =(id, senderId, text, createdAt) =>{
    console.log(id + ":" +senderId+ ":" +text + ":" +createdAt)
     const incomingMessage = {
       _id: id,
       text: text,
       createdAt: new Date(createdAt),
       user: {
         _id: senderId,
         name: senderId,
         avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmXGGuS_PrRhQt73sGzdZvnkQrPXvtA-9cjcPxJLhLo8rW-sVA"
       }
     }
     console.log(incomingMessage)
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
    this.initChat()
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate("Home")
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  onReceive = (id, senderId, text, createdAt) => {

    console.log(id + ":" +senderId+ ":" +text + ":" +createdAt)
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
    console.log(message)
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, message)
    }));
}

  render() {
    var chatkey = this.state.userid + this.state.authid
    //const {userid, authid} = this.props.navigation.state.params;
    return (
      <GiftedChat messages={this.state.messages}
      onSend={messages => this.onSend(messages)}
        user={{
        _id: 'u'
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
