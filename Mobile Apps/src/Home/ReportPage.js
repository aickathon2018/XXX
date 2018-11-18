import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Image, TextInput, Switch,ScrollView, Button} from 'react-native';
import {BackHandler, DeviceEventEmitter} from 'react-native';
import { createStackNavigator} from "react-navigation";
import {Icon} from 'react-native-elements';
import firebase from 'firebase';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import ChooseImageScreen from './chooseImageScreen';
import {saveReportDetails,editReportDetails,appendReportDetails,uploadReport} from './uploadDetails';
import PinLocation from './PinLocation';

const Dimensions = require('Dimensions');
WindowWidth=Dimensions.get('window').width;
WindowHeight=Dimensions.get('window').height;

//export default class Report extends React.Component{
class Report extends React.Component{
	static navigationOptions = {
		title: "ReportPage",
	};

	constructor() {
		super();
		this.state = {
			switchValue: false,
			userid:'unspecifiedUserID2',
			authorityid:'unspecifiedAuthorityID',
			type:'Reports',
			number_images:0,
			image: null,
			images: null,
			imageReturned: null,
			imagesReturned: [],
			publicSetting:'true',
			description:"empty",
			title:"no title",
			imageURL:null,
			latitudePinned:null,
			longitudePinned:null,
			addressPinned:null,
		}
		this.imageR=null;
	}
	/*
	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleBackPress = () => {
		this.props.navigation.navigate('Home');
		return true;
	}
	*/


	toggleSwitch=(value)=>{
		this.setState({switchValue:value})
		console.log('Switch is :'+value)
	}
	/*
	updateDetails = async() => {
		console.log("entered")
		const detail ={
			"description" : this.state.description,
			"publicSetting" : this.state.publicSetting,
			"userid" : this.state.userid,
			"authorityid" : this.state.authorityid,
			"description" : this.state.description,
			"title" : this.state.title,
		}

		//format: saveReportDetails = (type,objectID,details)
		//const ready = await saveReportDetails(this.state.type,this.state.reportid,detail).catch((error) => {console.log(error)})
		var newReportKey = firebase.database().ref().child('Reports').push().key;
		const ready = await uploadReport(this.state.type,newReportKey,detail).catch((error) => {console.log(error)})

		//const ready2 = await appendReportDetails('/Users/Normal/',this.state.userid,'/ReportsMade',this.state.reportid).catch((error) => {console.log(error)})

	}
	*/
	/*
	//to upload the image URL to the specific so that can retrieve afterwards
	updateURL = async() => {
		console.log("updating imageURL")
		//format: const editReportDetails = (type,objectID,param,paramDetail) => {
		const ready = await editReportDetails(this.state.type,this.state.reportid,'imageURLs',this.state.imageURL).catch((error) => {console.log(error)})
		console.log("done uploading everything")
		this.navigateBack();

	}
	*/

	submitReport=async()=>{
		const detail ={
			"description" : this.state.description,
			"publicSetting" : this.state.publicSetting,
			"userid" : this.state.userid,
			"authorityid" : this.state.authorityid,
			"description" : this.state.description,
			"title" : this.state.title,
			"longitude":this.state.longitudePinned,
			"latitude":this.state.latitudePinned,
			"location":this.state.addressPinned,
		}
		var newReportKey = firebase.database().ref().child('Reports').push().key;
		const waitUploadReport = await uploadReport(this.state.type,newReportKey,detail).catch((error) => {console.log(error)})

		if (this.state.number_images===0)
		{
			this.navigateBack();
		}
		else
		{
			var URLarray= [];
			for(var i=0; i<this.state.imageReturned.length;i++)
			{
				//the key = {i} below is needed because inside the array got 2 images, if they dont have unique key,
				//the DOM might mix them up
				//reference: second answer in https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js

				//format:uploadPhoto = (image, key,type, objectID)
				const waitUploadPhoto=await uploadPhoto(this.state.imageReturned[i],i,this.state.type, newReportKey)
				URLreturned=getURL();
				URLarray.push(URLreturned);
				//console.log(i)
			}
			//console.log(URLarray)
			this.setState({imageURL:URLarray});
			//console.log(this.state.imageURL);
			//this.updateURL();
			const waitUploadURL = await editReportDetails(this.state.type,newReportKey,'imageURLs',this.state.imageURL).catch((error) => {console.log(error)})
			this.navigateBack();
		}

	}

	myCallback=(dataPassed,dataPassed2)=>{
		this.setState({imageReturned: dataPassed})
		this.setState({number_images: dataPassed2})
	}
	DescriptionCallback=(dataPassed)=>{
		this.setState({description: dataPassed})
	}
	TitleCallback=(dataPassed)=>{
		this.setState({title: dataPassed})
	}
	LocationCallback=(latitude,longitude,address)=>{
		this.setState({latitudePinned: latitude})
		this.setState({longitudePinned: longitude})
		this.setState({addressPinned: address})
	}
	//backup for image show <Image source={require('../../images/googleMap.png')} style={{ width: WindowWidth-10, height: 160 }} />
	/*backup
	<Text>Latitude: {this.state.latitudePinned}</Text>
					<Text>Longitude: {this.state.longitudePinned}</Text>
					<Text>Address: {this.state.addressPinned}</Text>

	*/
	render(){


		return(

			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.text}>ReportPage</Text>
				<Text style={{color:'black'}}>Title of Report</Text>
				<View style={styles.title_box}>
					<CustomTextInputMultiline callbackFromParent={this.TitleCallback}/>
				</View>
				<Text style={{color:'black'}}>Description of Report</Text>
				<View style={styles.D_box}>
					<CustomTextInputMultiline callbackFromParent={this.DescriptionCallback}/>
				</View>
				<View style={styles.photoBox}>
					<ChooseImageScreen callbackFromParent={this.myCallback}/>
				</View>
				<Text style={{color:'black'}}>Location</Text>
				<View style={styles.locationBox}>
					<PinLocation callbackForLocation={this.LocationCallback}/>
				</View>
				<View style={styles.setting_box}>
					<Text textAlign={'left'} style={styles.settingText}>Authority</Text>
					<Text textAlign={'left'} style={styles.settingText}>tobeKnown</Text>
				</View>
				<View style={styles.setting_box}>
					<Text textAlign={'left'} style={styles.settingText}>Public</Text>
					<Switch
						onValueChange= {this.toggleSwitch}
						value={this.state.switchValue}
					/>
				</View>
				<Button onPress={()=> this.submitReport()} title={"Submit"} />
			</ScrollView>
		);
	}

}

/*
//dropdown backup
<View style={styles.setting_box}>
	<Text textAlign={'left'} style={styles.settingText}>Authority</Text>
	<ModalDropdown
		style={styles.bdropdown}
		textStyle={styles.dropdown_btext}
		dropdownStyle={styles.dropdown}
		dropdownTextStyle={styles.dropdown_text}
		options={['option 1', 'option 2','option 3']}
	/>

*/

export default Report;

const styles=StyleSheet.create({
	container:{
		//scrollView cannot put flex:1
		alignItems:'center',
		//justifyContent: 'center',
		backgroundColor: '#999'
	},
	text:{
		fontSize: 20,
		color: '#fff'
	},
	setting_box:{
		flexDirection: 'row',
		borderWidth: 2,
		alignSelf:'stretch',
		marginBottom:5,
		marginLeft:2,
		marginRight:2,
		justifyContent:'space-between',
		height:30,
		backgroundColor: 'rgba(360,360,360,1)'
	},
	title_box:{
		flex:1,
		flexDirection: 'row',
		borderWidth: 2,
		alignSelf:'stretch',
		marginBottom:5,
		marginLeft:2,
		marginRight:2,
		//alignItems: 'flex-start',
		//justifyContent:'space-between',
		height:50,
		backgroundColor: 'rgba(360,360,360,1)'
	},
	D_box:{
		flex:1,
		flexDirection: 'row',
		//flexWrap: 'wrap',
		borderWidth: 2,
		alignSelf:'stretch',
		marginBottom:5,
		marginLeft:2,
		marginRight:2,
		//alignItems: 'flex-start',
		//justifyContent:'space-between',
		height:140,
		backgroundColor: 'rgba(360,360,360,1)'
	},
	photoBox:{
		flexDirection:'column',
		borderWidth: 2,
		alignSelf:'stretch',
		marginBottom:5,
		marginLeft:2,
		marginRight:2,
		alignItems:'center',
		justifyContent:'space-around',
		backgroundColor: 'rgba(360,360,360,1)',
		height: 250
	},
	locationBox:{
		flexDirection:'column',
		borderWidth: 2,
		alignSelf:'stretch',
		marginBottom:5,
		marginLeft:2,
		marginRight:2,
		alignItems:'center',
		justifyContent:'space-around',
		backgroundColor: 'rgba(360,360,360,1)',
		height: 400
	},
	contentBoxes:{
		flexDirection:'column',
		borderWidth: 2,
		alignSelf:'stretch',
		marginBottom:5,
		marginLeft:2,
		marginRight:2,
		alignItems:'center',
		justifyContent:'center',
		backgroundColor: 'rgba(360,360,360,1)',
		height: 180
	},
	settingText:{
		fontSize:15,
		color: 'black',
		paddingLeft: 5
	},
	bdropdown:{
		borderColor:"black",
		borderWidth:1,
		backgroundColor: 'black',
	},
	dropdown:{
		borderColor:"black",
		borderWidth:1,
		backgroundColor: 'white',
	},
	dropdown_btext:{
		color: 'white',
		fontSize: 12,
		textAlign: 'center'
	},
	dropdown_text:{
		color: 'black',
		fontSize: 12,
		textAlign: 'center'
	},
	dropdown_2_text: {
		marginVertical: 10,
		marginHorizontal: 6,
		fontSize: 18,
		color: 'white',
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	dropdown_2_dropdown: {
		width: 150,
		height: 300,
		borderColor: 'cornflowerblue',
		borderWidth: 2,
		borderRadius: 3,
	},
	dropdown_2_row: {
		flexDirection: 'row',
		height: 40,
		alignItems: 'center',
	},
	  tabItem:{
	  alignItems: 'center',
	  paddingLeft:10,
	  paddingRight:10
	},
});
