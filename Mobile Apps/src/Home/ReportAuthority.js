import React from 'react';
import { ScrollView, StyleSheet, Text, View, Button, Alert, Image, BackHandler, ActivityIndicator} from 'react-native';
import styles from '../tabs/styles'
import * as firebase from 'firebase'

import { List, ListItem } from 'react-native-elements';
import {getFollowDetails} from '../components/RealTimeDatabase'

class ReportAuthority extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;

    constructor(props){
      super(props);
      this.state ={dataReady: false, users:[] }
      this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    )
      this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      this._onRefreshContact()
    )
    }

    componentDidMount() {
      this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      );

      this._onRefreshContact()
    }

    onBackButtonPressAndroid = () => {
      this.props.navigation.navigate("Report")
      return true
    };

    componentWillUnmount() {
      this._didFocusSubscription && this._didFocusSubscription.remove();
      this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    _click = ()=>{
      console.log("search")
    }

    onLearnMore = (authorityid, authority) => {
      console.log(authorityid, authority)
      this.props.navigation.navigate("Report", {authorityid, authority});
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
                onPress={() => this.onLearnMore(user.userid, user.name.toUpperCase())}
              />
            ))}
          </List>
          ):(
            <View>
              <ActivityIndicator color='orange' animating={true}/>
            </View>
    )

    const {users} = this.state
    return (
      <ScrollView>

        <ListItem
          title={"New Authority"}
          onPress={() => this._click()}
        />

        {data}
      </ScrollView>
    );
  }
}


export default ReportAuthority;
