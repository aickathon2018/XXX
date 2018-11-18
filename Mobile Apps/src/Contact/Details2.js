import React from 'react';
import { ScrollView, StyleSheet, Text, View, Alert, Image, BackHandler, ActivityIndicator} from 'react-native';

import { Tile, List, ListItem , Button,} from 'react-native-elements';
import Modal from 'react-native-modalbox'

import {checkFollowStatus, updateDetail, onFollowPress, uploadOrder, deleteAuth} from '../components/RealTimeDatabase'
import styles from '../tabs/styles'
import * as firebase from 'firebase'
import {QRCode} from 'react-native-custom-qr-codes'

class Details extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    headerStyle:{backgroundColor:'transparent'},
    headerBackTitle: null,
    headerTruncatedBackTitle: null,
  }

  constructor(props){
    super(props);
    this.state ={check: 0, doneCheck: false, follow: false, lastActive: ' ', submitLoading: false,}
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    //this._checkFollowStatus()
    })
  }

  _checkFollowStatus = async() =>{
    this.setState({check:check, doneCheck: false})
    const {productid} = this.props.navigation.state.params;
    var user = firebase.auth().currentUser;
    //const check = await checkLikeStatus(user.uid, userid)
    //console.log("check: "+ check)       setstatecheck:check,
    this.setState({doneCheck: true})
  }

  _checkOnline = async() =>{
    const {lastActive} = this.props.navigation.state.params;
    if (lastActive == 'Online'){
      this.setState({lastActive:lastActive})
    }else{
          var currentTime = Date.now()
          var activeTime = lastActive
          var offsetTime_ms = currentTime-activeTime
          var offsetTime_s = offsetTime_ms/1000
          var offsetTime_min = offsetTime_s/60
          var offsetTime_hr = offsetTime_min/60
          var offsetTime_day = offsetTime_hr/24

          var myDate = new Date( activeTime);
          var lastOnline = myDate.toUTCString()
          var timezone = 8
          var malTime = activeTime + 3600000*timezone
          var malDate = new Date(malTime);
          const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          var hour = (malDate.getUTCHours()<13)?(malDate.getUTCHours()):(malDate.getUTCHours() -12)
          if (hour == 0) {hour = 12}
          var min = (malDate.getUTCMinutes()<10)?('0'+malDate.getUTCMinutes()):(malDate.getUTCMinutes())
          var ampm = (malDate.getUTCHours()<12)?'am':'pm'
          var lastOnline_mal = day[malDate.getUTCDay()] +', '+ malDate.getUTCDate() + ' ' + month[malDate.getUTCMonth()] + ' '+ malDate.getUTCFullYear() + ' '+ hour + ':'+ min+ampm

          //var lastOnline_mal = malDate.getUTCHours()
          console.log('Active '+offsetTime_ms+ 'ms ago')
          console.log('Active '+offsetTime_s+ 's ago')
          console.log('Active '+offsetTime_min+ 'min ago')
          console.log('Active '+offsetTime_hr+ 'hour ago')
          console.log('Active '+offsetTime_day+ 'day ago')
          console.log('Last Active: '+ lastOnline_mal)

          if (offsetTime_s<60){
            this.setState({lastActive: 'Active '+Math.floor(offsetTime_s)+ 's ago'})
          }else if (offsetTime_min<60){
            this.setState({lastActive: 'Active '+Math.floor(offsetTime_min)+ ' min ago'})
          }else if (offsetTime_hr<24){
            this.setState({lastActive: 'Active '+Math.floor(offsetTime_hr)+ ' hour ago'})
          }else if (offsetTime_day<7){
            this.setState({lastActive: 'Active '+Math.floor(offsetTime_day)+ ' day ago'})
          }else{
            this.setState({lastActive: lastOnline_mal})
          }

      //var currentTime = firebase.database.ServerValue.TIMESTAMP
      //console.log('system time: '+ firebase.database.ServerValue.TIMESTAMP)
      //var activeTime = lastActive
      //var zzz = currentTime-activeTime
      //console.log('Last Active: '+zzz+ 'ms')
      //this.setState({lastActive: })
    }
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    const {previousScreen, id} = this.props.navigation.state.params;

    if (previousScreen == 'QRCode')
    this.props.navigation.navigate(previousScreen)

    if (previousScreen == 'Contact')
    this.props.navigation.navigate(previousScreen)

    if(previousScreen == 'Search')
    this.props.navigation.navigate(previousScreen, id)
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  onAddCart = async()=> {
    var user = firebase.auth().currentUser;
    const { name, productid, materials, tags, varities,manufacture, imageURL, price } = this.props.navigation.state.params;
    firebase.database().ref('users/'+user.uid+'/cart/').update({
        [productid]:3
    })
  }

  onBuyNow= async()=> {
    if (this.state.submitLoading == false){
      this.setState({submitLoading:true})
    }
    var user = firebase.auth().currentUser;
    var newOrderKey = firebase.database().ref().child('order').push().key;
    const { name, productid, materials, tags, varities,manufacture, imageURL, price } = this.props.navigation.state.params;

    var user = firebase.auth().currentUser;
    var time = new Date().getTime()

    const detail ={
			"productid" : productid,
			"value" : 3,
			"userid" : user.uid,
			"orderingTime" : time,
			"progress":0,
      "key":newOrderKey,
      "itemReady":0,
		}
      firebase.database().ref('order').update({
          [newOrderKey]: detail
        }
      ).catch((error)=>{
        reject(error)
      })
      firebase.database().ref('users/'+user.uid+'/order').update({
          [newOrderKey]: true
        }
      ).catch((error)=>{
        reject(error)
      })
      this.setState({submitLoading: true,})
      this.props.navigation.navigate("Home");
  }

  onChat (){
    var my = firebase.auth().currentUser;
    const {userid} = this.props.navigation.state.params;
    this.props.navigation.navigate('Chat', {authid: userid, userid: my.uid, username:my.displayName})
  }

  _click = () => {
   this.setState({
     follow: true
   })
  }

  _click2 = async() => {
    var my = firebase.auth().currentUser;
    const {userid} = this.props.navigation.state.params;

    if (this.state.check == 0){
      console.log("not follow")
      const ready = await onFollowPress(my.uid, userid)
      this.setState({follow: false})
      this.setState({check: 1})
    }else{
      console.log("follow")

      Alert.alert("Confirm Action", "Press ok to unfollow",[{text: 'Cancel'}, {text: 'OK', onPress: () => {this._unfollow()}}]);
    }
  }

    _unfollow = async() => {
      var my = firebase.auth().currentUser;
      const {userid} = this.props.navigation.state.params;
      const ready = await deleteAuth(my.uid, userid)
      this._checkFollowStatus()
      this.setState({follow: false})
      this.setState({check: 0})
    }

  render() {
    const { name, productid, materials, tags, varities,manufacture, imageURL, price } = this.props.navigation.state.params;

    const submit = this.state.submitLoading?(
			<View style={{flexDirection:'row'}}>
			<Text style={{fontSize:12, color:'rgba(255,255,255,0.7)'}}> Loading </Text>
			<ActivityIndicator color='rgba(255,255,255,0.7)' animating={true}/>
			</View>
		):(
			<Text style={{color:'rgba(255,255,255,0.7)'}}>Buy Now</Text>
		)

    const followStatus = this.state.doneCheck? ((this.state.check == 0)?
      (<Text style={{alignSelf:'center'}}>Not Followed (Double Tab Photo to follow)</Text>):
      (<Text style={{alignSelf:'center'}}>Followed</Text>)):(<Text> </Text>)

    const followOrUnfollow = (this.state.check == 0)? 'follow': 'unfollow'

      var profilePic = this.state.follow?(
        <Tile
          imageSrc={{uri: imageURL}}
          imageContainerStyle={{opacity:0.2}}
          activeOpacity= {1}
          onPress={this._click2}
          featured
          caption={'Tap Again to Like'}
          captionStyle = {{color: 'black'}}
        />
      ):(
        <Tile
          imageSrc={{uri: imageURL}}
          imageContainerStyle={{}}
          onPress={this._click}
          featured
          title={name}
          caption={price}
        />
      )

    return (
    <View>
      <ScrollView>
        {profilePic}
        {followStatus}
        <List>
              <ListItem
                title="Varities"
                rightTitle="tap to choose varities"
                onPress={() => this.refs.modalVarities.open()}
                hideChevron
              />

          <ListItem
            title="Manufacture"
            rightTitle={manufacture}
            onPress={() => this.refs.modalManufacture.open()}
            hideChevron
          />

          <ListItem
            title="Materials"
            rightTitle={materials}
            onPress={() => this.refs.modalMaterials.open()}
            hideChevron
          />
        </List>

        <List>
          <ListItem
            title="QR Code"
            rightTitle="Press for QR Code"
            onPress={() => this.refs.modalProductid.open()}
            hideChevron
          />
        </List>

        <Button
          title="Add to Cart"
          buttonStyle={{ marginTop: 20 }}
            onPress={this.onAddCart.bind(this)}
        />

        <Button
          title="Buy Now"
          buttonStyle={{ marginTop: 20 }}
            onPress={this.onBuyNow.bind(this)}
        />
      </ScrollView>

      <Modal style={styles.modalContainerAtDetails}
        position={"center"} backButtonClose={true} ref={"modalMaterials"} isDisabled={this.state.isDisabled}>
        <Text>Materials</Text>
        <Text style={{marginTop:15}}>{materials}</Text>
      </Modal>

      <Modal style={styles.modalContainerAtDetails}
        position={"center"} backButtonClose={true} ref={"modalManufacture"} isDisabled={this.state.isDisabled}>
        <Text>Manufactures</Text>
        <Text style={{marginTop:15}}>{manufacture}</Text>
      </Modal>

      <Modal style={styles.modalContainerAtDetails}
        position={"center"} backButtonClose={true} ref={"modalVarities"} isDisabled={this.state.isDisabled}>
        <Text>Address</Text>
        <Text style={{marginTop:15}}>Choose Varities:</Text>
      </Modal>


      <Modal style={styles.modalContainerAtDetails}
        position={"center"} backButtonClose={true} ref={"modalVarities"} isDisabled={this.state.isDisabled}>
        <Text>Address</Text>
        <Text style={{marginTop:15}}>Choose Varities:</Text>
      </Modal>

      <Modal style={styles.modalContainerUserid}
        position={"center"} backButtonClose={true} ref={"modalProductid"} isDisabled={this.state.isDisabled}>
        <Text>Product ID</Text>
        <Text>{productid} </Text>
        <QRCode content={productid} />
      </Modal>
    </View>
    );
  }
}

export default Details;
