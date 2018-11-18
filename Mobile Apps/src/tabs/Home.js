import React, {Component} from 'react';
import { AppState, StyleSheet, Text, ScrollView, View, Alert, Image,Dimensions, TextInput, BackHandler, TouchableOpacity, RefreshControl, ActivityIndicator} from 'react-native';
import styles from './styles'
import * as firebase from 'firebase'
import {Icon, SearchBar, Tile, Button, List, ListItem} from 'react-native-elements';
import {onFollowPress, updateDetail} from '../components/RealTimeDatabase'
import {QRCode} from 'react-native-custom-qr-codes'

var {height, width} = Dimensions.get('window')

class Home extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    tabBarLabel: "Home",
    tabBarIcon: ({tintColor}) => (
      <Icon type='font-awesome' color={tintColor} name='home' size={23}/>
    )
  }

  constructor(props){
    super(props);
    this.state ={
      name:'',
      refreshing: false,
      loading: true,
      dataReady:false,
      userid:' ',
      products:[],
      productsArray:[],
      appState: AppState.currentState,
      respond:['Waiting for Respond', 'Under Progress', 'Completed'],
      progress:['progress-one', 'progress-two', 'progress-full'],}
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    this._startup()
    this.updateReport ()
    this.refs._scrollView.scrollTo({x:0,y:30, animated:true})
  })
  }

  componentWillMount(){
    var user = firebase.auth().currentUser;
    var lastOnlineRef = firebase.database().ref('users/' +user.uid + '/lastActive');

    var connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', function(snap) {
      if (snap.val() === true) {

    // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
    //    var con = myConnectionsRef.push();

    // When I disconnect, remove this device
    //    con.onDisconnect().remove();

    // Add this device to my connections list
    // this value could contain info about the device or a timestamp too
    lastOnlineRef.set("Online");

    // When I disconnect, update the last time I was seen online
    lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
      }
    });
  }

  componentDidMount() {

    AppState.addEventListener('change', this._handleAppStateChange);
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>{
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    }
    );
//****************** andrew part *****************//
  }


  getDetails = (productKey) => {
    //console.log(userid)
    return new Promise ((resolve)=>{
      firebase.database().ref('product/'+productKey).once('value',(data)=>{
          //console.log(data.val())
          resolve(data.key)
      })
    })
  }

  getProductDet = async(productKey) =>{
    var reports = []
    console.log("pro:" + productKey)
    for (var i=0; i<productKey.length;i++)
    {
      reports.push(await this.getProductDetails(productKey[i]))
    }
    console.log(reports)
    this.setState({products:reports, dataReady: true})
    this.setState({loading: false, refreshing:false});
  }

  getProductDetails = (productid) => {
   console.log("HELLOooooo")
   return new Promise ((resolve)=>{
     firebase.database().ref('product/'+productid).once('value',(data)=>{
         //console.log(data.val())
         resolve(data.val())
     })
   })
 }

  updateReport = () =>{
    var user = firebase.auth().currentUser;
    var productsArray=[];
    UserReportRef=firebase.database().ref('/product')
    GetReportKey= UserReportRef.once("value",(snapshot)=>{
      snapshot.forEach((child)=>{
        productsArray.push(child.key);
      })
    this.setState({productsArray:productsArray})
    this.getProductDet(productsArray)
    });
  }

  viewComletedReport = () => {Alert.alert("hello", "Completed Report")}

  viewReportDetails = (product) => {
    this.props.navigation.navigate('Details', { ...product , previousScreen:'Home'});
    };

  //****************** andrew part *****************//

  onBackButtonPressAndroid = () => {
    Alert.alert("Exit", "Press YES to exit",[{text: 'No'},{text: 'Yes', onPress: () => BackHandler.exitApp()}]);
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
     if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
       console.log('App has come to the foreground!')
     }else{
       console.log('App has come to the background!')
     }
     this.setState({appState: nextAppState});
   }

  _startup = async() => {
    var user = firebase.auth().currentUser;
    console.log("start")
    const ready = await updateDetail('lastActive', "Online", user.uid)
  }

  _click = async() => {
    this.props.navigation.navigate("Cart");
  }

  _click2 = async() => {
   this.props.navigation.navigate("Report");
  }

  _click3 = async() => {
   this.refs._scrollView.scrollTo({x:0,y:30, animated:true})
  }

  _onRefresh = () => {
    console.log("refresh")
    this.setState({refreshing:true})
    this.updateReport ()
    this.refs._scrollView.scrollTo({x:0,y:30, animated:true})
  }

  getDate = (createdAt) =>{
    var time = new Date(createdAt)
    var date = time.toLocaleString()
    return (date)
  }

  render() {

    const reports = (this.state.productsArray.length == 0)?
    (<View>
         <Text style={{alignItems:'center',alignSelf:'center', marginTop:25}}>No product avaiable</Text>
    </View>
    ):(
      <View style= {{width:width}}>
          {this.state.products.map((product) => (
            <List>
              <ListItem
                key={product.productid}
                title={product.name}
                subtitle={product.price}
                onPress={() => this.viewReportDetails(product)}
              />
            <Tile
              imageContainerStyle={{opacity:1}}
              imageSrc={{uri:product.imageURL}}
              titleStyle={{fontSize:13, color:'black', paddingBottom:0, marginBottom:0}}
              captionStyle={{fontSize:15, color:'black', paddingTop:0, marginTop:0, fontWeight:'bold'}}
              featured
              onPress={() => this.viewReportDetails(product)}
            />
            </List>
          )).reverse()
          }
      </View>
    )

    const display = this.state.loading ?
    (
      <View>
      <Text style={{alignItems:"center"}}> Suggession </Text>
        <ActivityIndicator color='orange' animating={this.state.loading}/>
      </View>
    ):(
      <View style={{width:width,}}>
      <Text style={{alignItems:"center", alignSelf:"center"}}> Suggession </Text>
        {reports}
      </View>
    )

    return (
      <View style={{
        flex: 1,
        alignItems: 'center',}}>
      <View style={{height: 0, justifyContent: 'flex-start',alignItems: 'center', backgroundColor: 'rgba(255,119,26,0.85)', paddingVertical:30, paddingHorizontal:width, flexDirection:'row'}}>
      <TouchableOpacity
          style={{width:30, height:40, marginTop:14, marginLeft:0, paddingRight:0, backgroundColor: 'transparent', alignItems:'flex-end' }}
          activeOpacity={1}>
          <Icon type='feather' color='rgba(255,255,255,0.9)' name='search'/>
      </TouchableOpacity>
      <SearchBar
          lightTheme
          containerStyle = {{width:width - 80, marginTop:0, backgroundColor: 'transparent', borderTopColor:'transparent', borderBottomColor:'transparent'}}
          placeholder='Search'
          placeholderTextColor = 'rgba(255,119,26,1)'
          inputStyle={{borderRadius: 12, justifyContent:"center", backgroundColor:"rgba(255,255,255, 0.5)"}}
          textInputStyle={{marginLeft:20}}
          noIcon
          onTouchStart ={()=> {this.props.navigation.navigate('Search');}}
          clearIcon = {false}
          showLoadingIcon = {false}
          value ={this.state.name}
          onChangeText={name=> this.setState({name})}/>
          <TouchableOpacity
              style={{width:30, height:40, marginTop:11, marginLeft:5, paddingRight:0, backgroundColor: 'transparent', alignItems:'flex-start' }}
              onPress={this._click}>
              <Icon type='entypo' color='rgba(255,255,255,0.9)' name='notification' />
          </TouchableOpacity>
      </View>
      <ScrollView
        refreshControl={
        <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh}/>
        }
        ref='_scrollView'
      >

      {display}
      </ScrollView>
      <View style={{justifyContent: 'flex-end', flex:1, marginBottom:10, alignSelf: 'flex-end', marginRight: 10}}>

      <TouchableOpacity
          style={{width:40, height:40, marginTop:0, borderRadius: 25, marginLeft:0 , backgroundColor: 'rgba(255,255,255,0.8)', alignItems:'center' , justifyContent:'center'}}
          onPress={this._click3}>
          <Icon type='entypo' color={'rgba(255,119,26,0.85)'} name='chevron-small-up' size={30}/>
      </TouchableOpacity>

      </View>
    </View>
    );
  }
}

export default Home;



  //****************** andrew part *****************//
/*  getReportsKey=()=> {
		console.log("length",this.state.reportsMade.length);
		console.log("title report",this.state.reportsTitle)
		console.log("title length",this.state.reportsTitle.length)

		if (this.state.reportsMade.length!=0){
			const result=
        (<View>
			       <Text style={{alignItems:'center',alignSelf:'center', marginTop:25}}>No reports submitted</Text>
			  </View>)
			return result;
		}else{
			console.log("title here",this.state.reportsTitle)
			var listReportTitle=[];
			for (var i=0; i<this.state.reportsTitle.length;i++){
				var listReport={};
				var keyname=this.state.reportsMade[i];
				var titleArray=this.state.reportsTitle[i];
				listReport["title"]=titleArray[keyname];
				listReport["key"]=this.state.reportsMade[i];
				listReportTitle.push(listReport);
			}
				console.log("listReportTitle",listReportTitle);

				const result=
        (
          <View style= {{width:width}}>
            {this.state.reports.map((report) => (
              <List>
                <ListItem
                  key={report.key}
                  title={`${report.title.toUpperCase()}`}
                  onPress={() => this.viewReportDetails(report.key)}
                />

                <Tile
                  imageContainerStyle={{opacity:0.6}}
                  imageSrc={require('../icons/galaxy.jpg')}
                  icon={{name:'progress-one', type:'entypo'}}
                  title='PROGRESS:'
                  caption='Waiting for respond'
                  titleStyle={{fontSize:13, color:'black', paddingBottom:0, marginBottom:0}}
                  captionStyle={{fontSize:15, color:'black', paddingTop:0, marginTop:0, fontWeight:'bold'}}
                  featured
                  onPress={() => this.viewReportDetails(report.key)}
                />
              </List>
						)).reverse()
					  }
				</View>)
				return result;
		}
	}
*/
  //****************** andrew part *****************//

  /*      this.setState({reportsMade : reportsArray});
        //this.setState({reportsTitle : snapshot.val()});
        console.log(snapshot.val());

        //we cannot straight away push snapshot.val()
        var store=snapshot.val()
        var newPost = reportsArray.length - this.state.reportsTitle.length

        if (newPost != 0){
          for (var i =0; i != newPost; i++){
          var newobject={};
          var keyname = reportsArray[(this.state.reportsTitle.length + newPost)]
          console.log("keyname    :  " +keyname)
          newobject[keyname]=store[keyname];
          console.log("newobject",newobject);
          this.state.reportsTitle.push(snapshot.val());
        }}

      */

      /*
        getReportDetails = (reportKey) => {
      		console.log("getting details")
      		return new Promise ((resolve, reject)=>{
      			console.log("getting key")
      			ReportRef=firebase.database().ref('/Reports/'+reportKey)
      			GetReportDetail=ReportRef.once("value",(snapshot)=>{
      				console.log(snapshot.val())
      				this.setState({returnedDetail:snapshot.val()})
      				resolve(snapshot.val())
      				}
      				)
      		})
      	}
      */
