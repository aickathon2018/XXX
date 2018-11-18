import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Button,
	Image,
	ActivityIndicator,
	ScrollView
} from 'react-native';

import { createStackNavigator, createBottomTabNavigator} from "react-navigation";
import ImagePicker from 'react-native-image-crop-picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import uploadPhoto from './UploadPhoto';

export default class ChooseImageScreen extends React.Component{

	constructor(userid){
		super()
		//If you want to use this.props in the constructor, you need to pass props to super
		this.state={
			userid:userid,
			loading:false,
			imageChosen:null,
			chosen:false,
			imageshow:null,
			image: null,
			images: null
		}
		this.imagePath=null;
		this.getImageNuserid=this.getImageNuserid.bind(this);
		console.log('userid',this.state.userid)

	}

	pickSingle(cropit, circular=false) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      cropperCircleOverlay: circular,
      compressImageMaxWidth: 640,
      compressImageMaxHeight: 480,
      compressImageQuality: 0.5,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
    }).then(image => {
      console.log('received image', image);
	  uploadPhoto(image,'user123');
      this.setState({
        image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
        images: null,
		imageChosen:true,
      });
    }).catch(e => {
      console.log(e);
    });
  }

	getImageNuserid(){
		image=this.state.image;
		userid='user00123';
		return image,userid;
	}


	openPicker(){
		ImagePicker.openPicker({
			width:300,
			height:300,
			cropping: true,
			mediaType: 'photo'
		})
		.then(image=>{
			this.imagePath = image.path;

			console.log(this.imagePath);
			console.log(image);
			this.setState({
				imageshow: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
				images: null,
				imageChosen:true,
			});
			console.log(this.state.imageshow);
			this.setState({chosen: true})

		})
		.catch((error)=>{
			console.log("ImagePickerError:"+error)
		})


	}
	renderImage(image) {
    return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={image} />
  }

  renderAsset(image) {
    return this.renderImage(image);
  }
	static navigationOptions = {
		title: "Upload",
	};
	render(){
		//note that the ? is for if else state
		console.log("loading:" +this.state.loading);
		console.log("chosen:" +this.state.chosen);
		const hasChosen=this.state.imageChosen ?
			(<View style={styles.ImageContainer}>
				<ScrollView contentContainerStyle={styles.scrollImageContainer}>
					{this.state.image ? this.renderAsset(this.state.image) : null}
					<Image
						//style={{width:100,height:100,margin:5}}
						source={this.state.imageshow}
					/>
				</ScrollView>
				<View style={styles.verticalContainer}>
					<TouchableOpacity
						style={styles.tabItem}
						onPress={()=>{
								this.pickSingle();
						}}
					>
						<Icon  name="camera" size={25}/>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.tabItem}
						onPress={()=>{
								this.pickSingle();
						}}
					>
						<Icon  name="folder-image" size={25}/>
					</TouchableOpacity>
				</View>
			</View>)
			:
			(
			<View style={styles.ImageContainer}>
				<View style={styles.showImage}>
					<Text>No photos yet</Text>
				</View>
				<View style={styles.verticalContainer}>
					<TouchableOpacity
						style={styles.tabItem}
						onPress={()=>{
								this.pickSingle();
						}}
					>
						<Icon  name="camera" size={25}/>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.tabItem}
						onPress={()=>{
								this.pickSingle();
						}}
					>
						<Icon  name="folder-image" size={25}/>
					</TouchableOpacity>
				</View>
			</View>
			)

		const dps=this.state.chosen ?
		<ActivityIndicator animating={this.state.loading}/> :
		(<View style={styles.ImageContainer}>
				{hasChosen}
		</View>
		)

		return(

			<View style={styles.ImageContainer}>
				{dps}
			</View>

		);
	}
}


const styles=StyleSheet.create({
	container:{
		flex:1,
		alignItems:'center',
		justifyContent: 'center',
		backgroundColor: '#999'
	},
	text:{
		fontSize: 20,
		color: '#fff'
	},
	tabItem:{
	  alignItems: 'flex-end',
	  paddingTop:5,
	  paddingBottom:5
	},
	verticalContainer:{
		flexDirection:'column',
		justifyContent:'center',
		alignItems:'center',
		borderWidth:2,
		alignSelf: 'stretch',
		width:40,
	},
	ImageContainer:{
		flex:1,
		alignSelf: 'stretch',
		flexDirection:'row',
	},
	scrollImageContainer:{
		alignSelf: 'stretch',
		justifyContent:'center',
		flexDirection:'row',
	},
	MaxContainer:{
		flex:1,
		alignSelf: 'stretch',
		flexDirection:'column',
	},

	showImage:{
		flex:1,
		flexDirection:'column',
		justifyContent:'center',
		alignItems:'center',
		borderWidth:3,
		alignSelf:'stretch'
	}
});
