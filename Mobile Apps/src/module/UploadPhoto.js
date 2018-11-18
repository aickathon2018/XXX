import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Button,
	Image,
	ActivityIndicator
} from 'react-native';
import { createStackNavigator, createBottomTabNavigator} from "react-navigation";
import firebase from 'firebase'
import ImagePicker from 'react-native-image-crop-picker'
import RNFetchBlob from 'react-native-fetch-blob'

const uploadPhoto = (image, userid) => {

	console.log('running upload')
	const Blob=RNFetchBlob.polyfill.Blob
	const fs=RNFetchBlob.fs
	window.XMLHttpRequest=RNFetchBlob.polyfill.XMLHttpRequest
	window.Blob=Blob
	const uid= userid
	const imagePath = image.path
	mime=image.mime
	const imagename = image.modificationDate + '.jpg'
	let uploadBlob=null
	const imageRef = firebase.storage().ref(uid).child(imagename)
	fs.readFile(imagePath,'base64')
		.then((data)=>{
			return Blob.build(data, {type:'$(mime);BASE64' })
		})
		.then((blob)=>{
			uploadBlob=blob
			console.log(uploadBlob)
			return imageRef.put(blob, {contentType:mime})
		})
		.then(()=>{
			uploadBlob.close()
			return imageRef.getDownloadURL()
		})
		.then((url)=>{
			console.log(url)
		})
		.catch((error)=>{
			console.log(error)
		})

}



export default uploadPhoto;
