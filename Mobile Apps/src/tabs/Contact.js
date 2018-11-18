import React from 'react';
import { ScrollView, StyleSheet, Text, View, Button, Alert, Image, BackHandler,  ActivityIndicator} from 'react-native';
import styles from './styles'
import * as firebase from 'firebase'

import { List, ListItem } from 'react-native-elements';
import {getOrderDetails} from '../components/RealTimeDatabase'

class Contact extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    tabBarLabel: "Shop",
    tabBarIcon: ({tintColor}) => (
      <Image
        source = {require('../icons/shop.png')}
        style = {{width:22, height:22, tintColor: tintColor}}>
      </Image>)
  }

    constructor(props){
      super(props);
      this.state ={currentState: 'Contact',dataReady: false, orders:[], ready:['Preparing you Item','Item Ready']}
      this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        this._onRefreshContact()

      })
    }




    componentDidMount() {
      this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>{
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        clearInterval(this.count)
      }
      );
      this._onRefreshContact()
    }

    onBackButtonPressAndroid = () => {
      this.props.navigation.navigate("Home")
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
      console.log("hi")
      var my = firebase.auth().currentUser;
      var user = firebase.auth().currentUser;
      var orderArray=[];

      firebase.database().ref('users/'+my.uid+'/order').once('value',(snapshot)=>{
          //console.log(data.val())
          snapshot.forEach((child)=>{
            orderArray.push(child.key);
          })
        this.getOrderDet(orderArray)
      })
    }

    getProductDetails = (productid) => {
     console.log("HELLOooooo")
     return new Promise ((resolve)=>{
       firebase.database().ref('product/'+productid).once('value',(data)=>{
           resolve(data.val())
       })
     })
   }

    onLearnMore = async(productid) => {
      var product = await this.getProductDetails(productid)
      const {id} = this.state
      this.props.navigation.navigate('Details', { ...product});
    };

    getOrderDet = async(orderArray)=>{
      const order = await getOrderDetails(orderArray)
      //console.log(order)
      this.setState({orders:order, dataReady:true})
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
            {this.state.orders.map((order) => (
                <ListItem
                  key={order.productid}
                  title={this.state.ready[order.itemReady]}
                  subtitle={new Date(order.orderingTime).toLocaleString()}
                  onPress={() => this.onLearnMore(order.productid)}
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
        {data}
      </ScrollView>
    );
  }
}


export default Contact;
