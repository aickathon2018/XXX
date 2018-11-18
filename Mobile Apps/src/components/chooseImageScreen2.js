import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, TextInput, ActivityIndicator, TouchableOpacity} from 'react-native';
import styles from '../tabs/styles'

import * as firebase from 'firebase'
import ImagePicker from 'react-native-image-crop-picker'
import RNFetchBlob from 'react-native-fetch-blob'

class ChooseImageScreen extends React.Component {
	constructor(props){
		super(props);
		this.state = {userid: '', loading: false, dp: null,}
	}

	openPicker(){
		this.setState({ loading: true, userid:this.props.userid })

		//convert image into blob format
		const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob

		//console.log(this.props.userid)
		//const { uid } = this.state.userid
    //const uid = "12345"
		//console.log(uid)
		ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: 'photo'
    }).then(image => {
			const imagePath = image.path

      let uploadBlob = null

			//confirgure to save (edit uid and filename)
      const imageRef = firebase.storage().ref(this.state.userid).child("profilePic.jpg")

			//convert image from blob to jpg and base64
      let mime = 'image/jpg'
			fs.readFile(imagePath, 'base64')
        .then((data) => {
          //console.log(data);
          return Blob.build(data, { type: `${mime};BASE64` })
			})
			.then((blob) => {
          uploadBlob = blob
          return imageRef.put(blob, { contentType: mime })
        })
				.then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
				.then((url) => {

          let userData = {}
          //userData[dpNo] = url
          //firebase.database().ref('users').child(uid).update({ ...userData})

          let obj = {}
          obj["loading"] = false
          obj["dp"] = url
          this.setState(obj)

        })
        .catch((error) => {
          console.log(error)
					this.setState({ loading: false})
        })
    })
    .catch((error) => {
      console.log(error)
			this.setState({ loading: false})
    })
  }

	render() {
		const dpr = this.state.dp ? (<TouchableOpacity onPress={ () => this.openPicker() }><Image
         style={{width: 100, height: 100, margin: 5}}
         source={{uri: this.state.dp}}
       /></TouchableOpacity>) : (<Button
      onPress={ () => this.openPicker() }
      title={ "Change Picture" }
    />)

		const dps = this.state.loading ? <ActivityIndicator animating={this.state.loading} /> : (<View>
		 <View style={{flexDirection: "row"}}>
			 { dpr }
		 </View>
	 </View>)

    return (
      <View style = {{alignItems: 'center',}}>
				 { dps }
      </View>
      );
    }
  }

export default ChooseImageScreen;
