import React, {Component} from 'react';
import { ScrollView, RefreshControl, StyleSheet, Text, View, Alert, Image, TouchableOpacity, BackHandler, ActivityIndicator} from 'react-native';

import { Tile, List, ListItem, Button , FormLabel, FormInput} from 'react-native-elements';
import Modal from 'react-native-modalbox'

import styles from './styles'
import * as firebase from 'firebase'

import openPicker from '../components/UpdateProfilePic'
import {saveDetails, getUserDetails, updateDetail, updateAuthDetail} from '../components/RealTimeDatabase'

import {QRCode} from 'react-native-custom-qr-codes'

class AuthorityProfile extends React.Component{
  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    tabBarLabel: "Profile",
    tabBarIcon: ({tintColor}) => (
      <Image
        source = {require('../icons/login.png')}
        style = {{width:20, height:20, tintColor: tintColor}}>
      </Image>
    )
  }

  handleSettingsPress = () => {
      this.props.navigation.navigate('Settings');
    };

  constructor(props){
    super(props);
    this.state ={
      userid:' ',
      refreshing: false,
      age:' ',
      newAge: ' ',
      date:' ',
      gender:' ',
      name:' ',
      email:' ',
      photoPath:' ',
      phone:' ',
      newPhone:' ',
      username:' ',
      Birthday:' ',
      newBirthday:' ',
      address: ' ',
      newAddress:' ',
      changePic: false,
      city:' ',
      newCity:' ',}

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    )
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
    this.getUserDetails()
    )
  }

  componentDidMount() {
    this.getUserDetails()

    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate("AuthorityHome")
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
    console.log("end")
  }

  getUserDetails(){
    console.log("update")
    var user = firebase.auth().currentUser;
    var details, name, gend, email, photoUrl, uid, emailVerified;

    if (user != null) {
      name = user.displayName
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                   // this value to authenticate with your backend server, if
                   // you have one. Use User.getToken() instead.
      console.log("  Email Verified: " + emailVerified);
      console.log("  Provider-specific UID: " + uid);
      console.log("  Name: " + name);
      console.log("  Email: " + email);
      console.log("  Photo URL: " + photoUrl);
      this._getDetails(uid)
      this.setState({
        name: name,
        email:email,
        photoPath: photoUrl,
        userid: uid,
        refreshing: false,
      })
    }
    setTimeout(() => {this.syncData()}, 300)
  }

  syncData(){
    this._updateDetails()
  }

  _updateDetails = async() => {
    const detail ={
      "name" : this.state.name,
      "email" : this.state.email,
      "photoURL" : this.state.photoPath,
      "userid" : this.state.userid,
    }
    const ready = await saveDetails(detail).catch((error) => {
      console.log(error)
    })
    console.log(ready)
  }

  _getDetails = async(uid) => {
    const detail = await getUserDetails(uid)
    console.log(detail)
    this.setState({
      phone: detail.phone,
      age: detail.age,
      gender: detail.gender,
      address: detail.address,
      date: detail.lastActive,
      birthday: detail.birthday,
      age: detail.age,
      city: detail.city,
    })
  }

  onLogOutPress(){
    Alert.alert("Sign out", "Press confirm to signout",
    [{text: 'Cancel'},
    {text:'Confirm',
    onPress: () => {
      firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("signout")
    })
    this._disconnect()
    this.props.navigation.navigate("Login")}}]);
  }

  _disconnect = async() => {
   const ready = await updateDetail('lastActive', firebase.database.ServerValue.TIMESTAMP, this.state.userid)
  }

  onUploadPhotoPress(){
      console.log('Profile up')
      var user = firebase.auth().currentUser;

      user.updateProfile({
      photoURL: this.state.photoPath
      }).then(function() {
        // Update successful.
      console.log("Photo Updated")
      }).catch(function(error) {
        // An error happened.
      });
      this.setState({photoPath: user.photoURL, loading: false})
  }

  _click = () => {
   this.setState({
     changePic: true
   })
  }

  _click2 = async() => {
    this.setState({loading: true})
    console.log(this.state.photoPath)
   const photoPath = await openPicker(this.state.userid, 'ProfilePic.jpg').catch((error) => {
     console.log(error)
   })
   this.setState({photoPath: photoPath})
   this.onUploadPhotoPress()
   setTimeout(() => {this.getUserDetails()}, 800)
   this.setState({ loading: false})
  }

  _onRefresh = () => {
    console.log("refresh")
    this.setState({refreshing:true})
    this.getUserDetails()
    //this.props.navigation.navigate('Loading')
  }

  _onNameUpdate = async(firstName, surname) =>{
    var user = firebase.auth().currentUser;
    if (firstName != null && surname != null && firstName != '' && surname!= '')
    {
      const name = firstName + ' ' +surname
      user.updateProfile({
      displayName: name
      }).then(function() {
        // Update successful.
      }).catch(function(error) {
        // An error happened.
      });
      const ready = await updateDetail('name', name, this.state.userid)
      const ready2 = await updateAuthDetail('Name', `${name.toUpperCase()}`, user.uid)
      this.setState({name:name})
      this.refs.modalName.close()
    }
  }

  _onPhoneUpdate = async(phone) =>{
    const ready = await updateDetail('phone', phone, this.state.userid)
    this.setState({phone:phone})
    this.refs.modalPhone.close()
  }

  _onAgeUpdate = async(age) =>{
    const ready = await updateDetail('age', age, this.state.userid)
    this.setState({age:age})
    this.refs.modalAge.close()
  }

  _onBirthdayUpdate = async(birthday) =>{
    const ready = await updateDetail('birthday', birthday, this.state.userid)
    this.setState({birthday:birthday})
    this.refs.modalBirthday.close()
  }

  _onAddressUpdate = async(address) =>{
    const ready = await updateDetail('address', address, this.state.userid)
    this.setState({address:address})
    this.refs.modalAddress.close()
  }

  _onCityUpdate = async(city) =>{
    const ready = await updateDetail('city', city, this.state.userid)
    this.setState({city:city})
    this.refs.modalCity.close()
  }

  _onGenderUpdate = async(gender) =>{
    const ready = await updateDetail('gender', gender, this.state.userid)
    this.setState({gender:gender})
  }

  _onGenderPress = () =>{
    var gender
    Alert.alert("Gender", "Press choose your gender",
    [{text: 'Male', onPress: () => {this._onGenderUpdate('Male')}},
    {text: 'Female', onPress: () => {this._onGenderUpdate('Female')}}]);
  }

  render() {
//source={{uri: this.state.photoPath}}/>
    if (this.state.changePic === true){
      setTimeout(() => {this.setState({changePic: false})}, 1000)
    }

    console.log(this.state.changePic)

    var profilePic = this.state.changePic?(
      <Tile
        imageSrc={{uri: this.state.photoPath}}
        imageContainerStyle={{opacity:0.2}}
        activeOpacity= {1}
        onPress={this._click2}
        featured
        caption={'Tap Again to Change Your Profile Photo'}
        captionStyle = {{color: 'black'}}
      />
    ):(
      <Tile
        imageSrc={{uri: this.state.photoPath}}
        imageContainerStyle={{}}
        onPress={this._click}
        featured
        title={`${this.state.name.toUpperCase()}`}
        caption={this.state.email}
      />
    )

    const dps = this.state.loading ?
    (<View style={{padding:135}}>
        <ActivityIndicator animating={this.state.loading}/>
    </View>
  ):(
    <View>
		 <View style={{flexDirection: "row"}}>
			 { profilePic }
		 </View>
	 </View>)

    return (
    <View style={{flex:1}}>

      <ScrollView
        refreshControl={
          <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}/>
        }>

        {dps}

        <Button
          title="Settings"
          buttonStyle={{ marginTop: 20 }}
          onPress={this.handleSettingsPress.bind(this)}
        />

        <List>
          <ListItem
            title="Name"
            rightTitle={this.state.name}
            onPress={() => this.refs.modalName.open()}
            hideChevron
          />
          <ListItem
            title="Email"
            rightTitle={this.state.email}
            onPress={() => this.props.navigation.navigate("AuthorityReauthenticate",{action : 'Change Email'})}
            hideChevron
          />
          <ListItem
            title="Phone"
            rightTitle={this.state.phone}
            onPress={() => this.refs.modalPhone.open()}
            hideChevron
          />
        </List>

        <List>
          <ListItem
            title="Username"
            rightTitle={this.state.userid}
            onPress={() => this.refs.modalUserid.open()}
            hideChevron
          />
          <ListItem
            title="Change Password"
            rightTitle={'********'}
            onPress={() => this.props.navigation.navigate("AuthorityReauthenticate",{action : 'Change Password'})}
            hideChevron
          />
          <ListItem
            title="Last Active"
            rightTitle={'Online'}
            hideChevron
          />
        </List>

        <List>
        <ListItem
          title="Age"
          rightTitle={this.state.age}
          onPress={() => this.refs.modalAge.open()}
          hideChevron
        />
          <ListItem
            title="Gender"
            rightTitle={this.state.gender}
            onPress= {this._onGenderPress}
            hideChevron
          />
          <ListItem
            title="Birthday"
            rightTitle={this.state.birthday}
            onPress={() => this.refs.modalBirthday.open()}
            hideChevron
          />
          <ListItem
            title="Address"
            rightTitle={this.state.address}
            onPress={() => this.refs.modalAddress.open()}
            hideChevron
          />
          <ListItem
            title="City"
            rightTitle={this.state.city}
            onPress={() => this.refs.modalCity.open()}
            hideChevron
          />
        </List>

        <Button
          title="Sign Out"
          buttonStyle={{ marginTop: 20 }}
            onPress={this.onLogOutPress.bind(this)}
        />

        <Button
          title="Delete Account"
          buttonStyle={{ marginTop: 5 , marginBottom:15}}
          onPress={() => this.props.navigation.navigate("AuthorityReauthenticate",{action : 'Delete Account'})}
        />
        </ScrollView>

        <Modal style={styles.modalContainer2}
          position={"center"} backButtonClose={true} ref={"modalName"} isDisabled={this.state.isDisabled}>
          <Text style={{marginTop:20, fontSize: 20}}>Change Name</Text>
          <FormLabel containerStyle={{marginTop:0, marginBottom:0, paddingBottom:0}}>First Name</FormLabel>
          <FormInput containerStyle={styles.ModalInputContainer}
          inputStyle={styles.ModalInput}
           onChangeText={firstName => this.setState({firstName})}/>
          <FormLabel>Surname</FormLabel>
          <FormInput containerStyle={[styles.ModalInputContainer]}
          inputStyle={styles.ModalInput}
          onChangeText={surname => this.setState({surname})}/>
          <TouchableOpacity
              style={[styles.loginButton,{marginTop:10}]}
             onPress={() => this._onNameUpdate(this.state.firstName, this.state.surname)}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </Modal>

        <Modal style={styles.modalContainer}
          position={"center"} backButtonClose={true} ref={"modalPhone"} isDisabled={this.state.isDisabled}>
          <Text style={{marginTop:20, fontSize: 20}}>Change Phone</Text>
          <FormLabel containerStyle={{marginTop:30,}}>Please Enter your phone</FormLabel>
          <FormInput containerStyle={styles.ModalInputContainer}
            inputStyle={styles.ModalInput}
           onChangeText={newPhone => this.setState({newPhone})}/>
          <TouchableOpacity
              style={[styles.loginButton, {marginTop:25}]}
             onPress={() => this._onPhoneUpdate(this.state.newPhone)}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </Modal>

        <Modal style={styles.modalContainerUserid}
          position={"center"} backButtonClose={true} ref={"modalUserid"} isDisabled={this.state.isDisabled}>
          <Text>Username</Text>
          <QRCode content={this.state.userid} backgroundImage={require('../icons/galaxy2.jpg')} codeStyle='circle'/>
          <Text style={{marginTop:5}}>{this.state.userid}</Text>
        </Modal>

        <Modal style={styles.modalContainer}
          position={"center"} backButtonClose={true} ref={"modalAge"} isDisabled={this.state.isDisabled}>
          <Text style={{marginTop:20, fontSize: 20}}>Age</Text>
          <FormLabel containerStyle={{marginTop:30,}}>Please enter your age</FormLabel>
          <FormInput containerStyle={styles.ModalInputContainer}
            inputStyle={styles.ModalInput}
           onChangeText={newAge => this.setState({newAge})}/>
          <TouchableOpacity
              style={[styles.loginButton, {marginTop:25}]}
             onPress={() => this._onAgeUpdate(this.state.newAge)}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </Modal>

        <Modal style={styles.modalContainer}
          position={"center"} backButtonClose={true} ref={"modalBirthday"} isDisabled={this.state.isDisabled}>
          <Text style={{marginTop:20, fontSize: 20}}>Birthday</Text>
          <FormLabel containerStyle={{marginTop:30,}}>Please enter your birthday</FormLabel>
          <FormInput containerStyle={styles.ModalInputContainer}
            inputStyle={styles.ModalInput}
           onChangeText={newBirthday => this.setState({newBirthday})}/>
          <TouchableOpacity
              style={[styles.loginButton, {marginTop:25}]}
             onPress={() => this._onBirthdayUpdate(this.state.newBirthday)}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </Modal>

        <Modal style={styles.modalContainer}
          position={"center"} backButtonClose={true} ref={"modalAddress"} isDisabled={this.state.isDisabled}>
          <Text style={{marginTop:20, fontSize: 20}}>Address</Text>
          <FormLabel containerStyle={{marginTop:30,}}>Please enter your address</FormLabel>
          <FormInput containerStyle={styles.ModalInputContainer}
            inputStyle={styles.ModalInput}
           onChangeText={newAddress => this.setState({newAddress})}/>
          <TouchableOpacity
              style={[styles.loginButton, {marginTop:25}]}
             onPress={() => this._onAddressUpdate(this.state.newAddress)}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </Modal>

        <Modal style={styles.modalContainer}
          position={"center"} backButtonClose={true} ref={"modalCity"} isDisabled={this.state.isDisabled}>
          <Text style={{marginTop:20, fontSize: 20}}>City</Text>
          <FormLabel containerStyle={{marginTop:30,}}>Please enter your city</FormLabel>
          <FormInput containerStyle={styles.ModalInputContainer}
            inputStyle={styles.ModalInput}
           onChangeText={newCity => this.setState({newCity})}/>
          <TouchableOpacity
              style={[styles.loginButton, {marginTop:25}]}
             onPress={() => this._onCityUpdate(this.state.newCity)}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

export default AuthorityProfile;
