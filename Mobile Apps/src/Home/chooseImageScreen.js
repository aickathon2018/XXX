import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Button,
	Image,
	Alert,
	ActivityIndicator,
	ScrollView
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker'
import {Icon} from 'react-native-elements';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import uploadPhoto from './uploadPhoto';


const Dimensions = require('Dimensions');
width=Dimensions.get('window').width;
height=Dimensions.get('window').height;

export default class ChooseImageScreen extends React.Component{

	constructor(props){
		super(props)
		//If you want to use this.props in the constructor, you need to pass props to super
		this.state={
			loading:false,
			imageChosen:null,
			chosen:false,
			imageshow:null,
			imagesshow:[],
			image: null,
			images: null,
			imagePath:null,
			number_images:0,
		}

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
      //console.log('received image', image);

      this.setState({
		imagereturn: image,
        image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
        images: null,
		imageChosen:true,
      });
	  this.props.callbackFromParent(image);
    }).catch(e => {
      console.log(e);
    });
  }

   openCamera() {
    ImagePicker.openCamera({
	  width: 300,
      height: 300,
	  cropping: true,
	  mediaType: 'photo'
    }).then(images => {
      this.setState({
        images: images.map(i => {
		  this.setState({number_images: this.state.number_images+1})
          //console.log('received image', this.state.number_images);

		  //the following return is important to give the values to this.state.images
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        }),
		imageChosen:true,
      });
	  console.log("image_choose",images)
	  console.log("this.image_choose",this.state.images)
	  this.props.callbackFromParent(images,this.state.number_images);
    }).catch(e => {
      console.log(e);
    });
  }


   pickMultiple(cropit, circular=false) {
    ImagePicker.openPicker({
	  multiple:true,
	  width: 300,
      height: 300,
      waitAnimationEnd: false,
      forgeJpg: true,
      includeExif: true,
    }).then(images => {
      this.setState({
        images: images.map(i => {
		  this.setState({number_images: this.state.number_images+1})
          //console.log('received image', this.state.number_images);

		  //the following return is important to give the values to this.state.images
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        }),
		imageChosen:true,
      });
	  console.log("image_choose",images)
	  console.log("this.image_choose",this.state.images)
	  this.props.callbackFromParent(images,this.state.number_images);
    }).catch(e => {
      console.log(e);
    });
  }

	renderImage(image) {
    return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={image} />
  }
  renderImages(images) {
	//console.log("images type", typeof images)
	arraylength=images.length;
	for(var i=0; i<arraylength;i++)
	{
		//the key = {i} below is needed because inside the array got 2 images, if they dont have unique key,
		//the DOM might mix them up
		//reference: second answer in https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js
		//THERE IS A BUG FOR PASS!!! IT WILL PASS TWO TIMES AND I DONT KNOW HOW TO SOLVE, THE FOLLOWING IF STATEMENT IS HOW I SOLVE IT
		if (this.state.imagesshow.length < this.state.number_images)
		 {this.state.imagesshow.push(<Image key={i} style={styles.imagesStyle} source={images[i]} />)
		 }
	}
	return this.state.imagesshow;
  }

	render(){
		//note that the ? is for if else state
		const hasChosen=this.state.imageChosen ?
			(<View style={styles.ImageContainer}>
				<ScrollView contentContainerStyle={styles.scrollImageContainer}>
					{this.state.images ? this.renderImages(this.state.images) : null}
				</ScrollView>
				<View style={styles.verticalContainer}>
					<TouchableOpacity
						style={styles.tabItem, {marginRight:width/8}}
						onPress={()=>{
								this.openCamera();
								this.setState({imageChosen:false})
						}}
					>
					<Icon type='entypo' name='camera' size={25} color='#1c313a'/>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.tabItem, {marginLeft:width/8}}
						onPress={()=>{
								this.pickMultiple();
								this.setState({imageChosen:false})
						}}
					>
						  <Icon type='entypo' name='archive' size={25} color='#1c313a'/>
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
						style={styles.tabItem, {marginRight:width/8}}
						onPress={()=>{
								this.openCamera();
								this.setState({imageChosen:false})
						}}
					>
						<Icon type='entypo' name='camera' size={25} color='#1c313a'/>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.tabItem, {marginLeft:width/8}}
						onPress={()=>{
								this.pickMultiple();
								this.setState({imageChosen:false})
						}}
					>
						<Icon type='entypo' name='archive' size={25} color='#1c313a'/>
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
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
		alignSelf: 'center',
	},
	ImageContainer:{
		flex:1,
		alignSelf: 'stretch',
	},
	scrollImageContainer:{
		alignSelf: 'stretch',
		justifyContent:'center',
		alignItems:'center',
		flexDirection:'column',
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
		alignSelf:'stretch'
	},
	imagesStyle:{
		width:300,
		height:300,
		resizeMode: 'contain',
		marginBottom:2,
		marginTop:2,
	},
});
