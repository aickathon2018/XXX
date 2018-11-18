import React, {Component} from 'react';
import { ScrollView, RefreshControl, StyleSheet, Text, View, Alert, Image, TouchableOpacity, BackHandler, ActivityIndicator} from 'react-native';

import { Tile, List, ListItem, Button } from 'react-native-elements';

import * as firebase from 'firebase'
import {getFollowDetails} from '../components/RealTimeDatabase'


/*
firebase.database().ref('users/002').set(
  {
    name: 'Charis Wee',
    age: 20}
).then(()=> {
  console.log("INSERTED")
}).catch((error)=>{
  console.log(error)
})

firebase.database().ref('users').on('value',(data)=>{
  console.log(data)
})

firebase.database().ref('users').once('value',(data)=>{
  console.log(data)
})

firebase.database().ref('users/001').update({
  name: 'Liew'
})

firebase.database().ref('users/001/name').remove({}
})

var name
firebase.database().ref('users/002/').on('value',(data)=>{
  name = data.val().name
  console.log(name)
})


var name = 'Hello'
firebase.database().ref('users/002').set(
  {
    [name]: 'Charis Wee',
    age: 20}
).then(()=> {
  console.log("INSERTED")
}).catch((error)=>{
  console.log(error)
})

onFollowPress = () =>{
  var n
  console.log("Press")
  firebase.database().ref('users/czqy7bFKnFeEQezJMxMGLABuSDs2/Subscribed/Subscribed').once('value',(data)=>{
    n = data.val()
    console.log(n)
    firebase.database().ref('users/czqy7bFKnFeEQezJMxMGLABuSDs2/Subscribed/').update({
      [n+1] : '56789',
      Subscribed: n+1,
    }).then(()=> {
      console.log("INSERTED")
    }).catch((error)=>{
      console.log(error)
    })

  })
}

*/

class AccountDetails extends React.Component {

  render(){
    console.log("hi")
    

    return(
      <View>
      <Text>123</Text>
      </View>
    )
}
}


/*
  getDetails = (userid) => {
    //console.log(userid)
    return new Promise ((resolve)=>{
      firebase.database().ref('users/'+userid).once('value',(data)=>{
          console.log(data.val())
          resolve(data.val())
      })
    })
  }


    onFollowPress = (userid, followid) =>{
      var n
      console.log("Press")
      firebase.database().ref('users/'+userid+'/Subscribed/Subscribed').once('value',(data)=>{
        n = data.val()
        console.log(n)
        firebase.database().ref('users/'+userid+'/Subscribed/').update({
          [n+1] : followid,
          Subscribed: n+1,
        }).then(()=> {
          console.log("INSERTED")
        }).catch((error)=>{
          console.log(error)
        })
      })
    }

    onFollowPress = async() =>{
      const users = await getFollowDetails('czqy7bFKnFeEQezJMxMGLABuSDs2')
      console.log(users)
    }

  getUserDetails = async() => {
    var user, n
    var userid = []
    var count = 0
    var users = []
    var detail = []
    //userid [0] = "Hello"
    return new Promise ((resolve)=>{

      firebase.database().ref('users/czqy7bFKnFeEQezJMxMGLABuSDs2/Subscribed/Subscribed').once('value',(data)=>{
        n = data.val()
        for (var i=1; i<=n; i++)
        {
              firebase.database().ref('users/czqy7bFKnFeEQezJMxMGLABuSDs2/Subscribed/'+ i).once('value',(data)=>{
              userid.push(data.val().toString());
            }).then(()=> {
              console.log(count)
              count = count + 1
              if (count ==n)
              {console.log(userid)
                resolve(userid)
              }
            }).catch((error)=>{
              console.log(error)
            })
        }
      })
    })
  }

  onFollowPress = async() =>{
    var userid
    var users = []
    console.log("test")
    userid = await this.getUserDetails()
    console.log(userid.length)
    for (var i=0; i<userid.length;i++)
    {
      users.push(await this.getDetails(userid[i]))
    }
    console.log(users)
    return new Promise ((resolve)=>{
      resolve(users)
    })
  }
*/

export default AccountDetails
