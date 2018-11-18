import React from 'react';
import { ScrollView, StyleSheet, Text, View, Button, Alert, Image, BackHandler,  ActivityIndicator} from 'react-native';
import styles from './styles'
import * as firebase from 'firebase'

import { List, ListItem } from 'react-native-elements';
import {getFollowDetails, getUserDetails} from '../components/RealTimeDatabase'

class AuthorityContact extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    tabBarLabel: "Chat",
    tabBarIcon: ({tintColor}) => (
      <Image
        source = {require('../icons/contact.png')}
        style = {{width:22, height:22, tintColor: tintColor}}>
      </Image>)
  }

    constructor(props){
      super(props);
      this.state ={currentState: 'Contact',dataReady: false, users:[], chatsArray:[], loading: true, refreshing:false}
      this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    )
      this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      this.updateChat()
    )
    }

    componentDidMount() {
      this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      );
      this.updateChat()
    }

    onBackButtonPressAndroid = () => {
      this.props.navigation.navigate("AuthorityHome")
      return true
    };

    componentWillUnmount() {
      this._didFocusSubscription && this._didFocusSubscription.remove();
      this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    onLearnMore = (user) => {
      console.log(user)
      this.props.navigation.navigate('Details', { ...user , previousScreen:'Contact'});
    };

    _onRefreshContact = async() =>{
      var my = firebase.auth().currentUser;
      const users = await getFollowDetails(my.uid)
      users.sort(function(users1, users2){
          if (users1.name>users2.name)
          return 1
          if (users1.name<users2.name)
          return -1
      })
      this.setState({dataReady: true, users:users})
    }

    updateChat = () =>{
      var user = firebase.auth().currentUser;
      var chatsArray=[];
      UserReportRef=firebase.database().ref('/users/'+user.uid+'/Chat').orderByValue()
      GetReportKey= UserReportRef.once("value",(snapshot)=>{
        snapshot.forEach((child)=>{
          console.log(child.key)
          chatsArray.push(child.key);
        })
      this.setState({chatsArray:chatsArray})
      this.getChatDet(chatsArray)
      });
    }

    getChatDet = async(roomids) =>{
      //var chats = []
      var users = []
      console.log(roomids)
      for (var i=0; i<roomids.length;i++)
      {
        var id = []
        var roomid = roomids[i]
        while (roomid){
          if (roomid.length<28){
            id.push(roomid)
            break;
          }else{
            id.push(roomid.substr(0,28))
            roomid = roomid.substr(28)
          }
        }
        console.log(id[1])
        users.push(await getUserDetails(id[0]))
      }
      //console.log(chats)
      this.setState({dataReady:true, loading: false, refreshing:false, users:users});
    }

    onChat (authid){
      var my = firebase.auth().currentUser;
      this.props.navigation.navigate('AuthorityChat', {authid: authid, userid: my.uid, username:my.displayName})
    }

    render() {
/*      {users.map((user) => (
        <ListItem
          key={user.login.username}
          roundAvatar
          avatar={{ uri: user.picture.thumbnail }}
          title={`${user.name.first.toUpperCase()} ${user.name.last.toUpperCase()}`}
          subtitle={user.phone}
          onPress={() => this.onLearnMore(user)}
        />
      ))}
      */
      const data = this.state.dataReady? (
        <List>
            {this.state.users.map((user) => (
                <ListItem
                  key={user.userid}
                  roundAvatar
                  avatar={{ uri: user.photoURL }}
                  title={`${user.name.toUpperCase()}`}
                  subtitle={user.phone}
                  onPress={() => this.onLearnMore(user)}
                />
              ))}
        </List>
      ):(
        <View>
          <ActivityIndicator color='orange' animating={true}/>
        </View>
      )

      const data2 = this.state.dataReady? (
        <List>
            {this.state.users.map((user) => (
                <ListItem
                  key={user.userid}
                  roundAvatar
                  avatar={{ uri: user.photoURL }}
                  title={`${user.name.toUpperCase()}`}
                  onPress={() => this.onChat(user.userid)}
                />
              )).reverse()}
        </List>
      ):(
        <View>
          <ActivityIndicator color='orange' animating={true}/>
        </View>
      )

    const {users} = this.state
    return (
      <ScrollView>
        {data2}
      </ScrollView>
    );
  }
}


export default AuthorityContact;
