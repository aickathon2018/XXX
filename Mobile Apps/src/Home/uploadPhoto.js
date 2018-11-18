import firebase from 'firebase'
import ImagePicker from 'react-native-image-crop-picker'
import RNFetchBlob from 'react-native-fetch-blob'

var URL;

const getURL=()=>{
	console.log("Retrurning URL",URL)
	return URL;
}

const uploadPhoto = (image, key, type, objectID) => {


	console.log('running upload')
	const Blob=RNFetchBlob.polyfill.Blob
	const fs=RNFetchBlob.fs
	window.XMLHttpRequest=RNFetchBlob.polyfill.XMLHttpRequest
	window.Blob=Blob
	const imagePath = image.path
	const uid = type+"/"+objectID
	mime=image.mime
	const imagename = image.modificationDate +key+ '.jpg'
	let uploadBlob=null
	const imageRef = firebase.storage().ref(uid).child(imagename)
	return new Promise ((resolve, reject)=>{
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
				//console.log("return here",imageRef.getDownloadURL())
				return imageRef.getDownloadURL()

			})
			.then((url)=>{
				URL=url
				//getURL()
				console.log(url)
				resolve(true)
			})
			.catch((error)=>{
				console.log(error)
				reject(error)
			})
	})

};

export {uploadPhoto,getURL};
