import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Image, TextInput, Switch,ScrollView, Button, BackHandler} from 'react-native';

import * as firebase from 'firebase'
import {uploadPhoto} from './uploadPhoto';
import {saveReportDetails,editReportDetails} from './uploadDetails';

//import {, DeviceEventEmitter} from 'react-native';
//import { createStackNavigator} from "react-navigation";
//import {Icon} from 'react-native-elements';
//import ModalDropdown from 'react-native-modal-dropdown';
//import UploadImageScreen from './UploadImageScreen';
//import firebase from 'firebase';
//import ImagePicker from 'react-native-image-crop-picker';
//import RNFetchBlob from 'react-native-fetch-blob';
//import ChooseImageScreen from './chooseImageScreen';
//import CustomTextInputMultiline from './CustomTextInput';

const Dimensions = require('Dimensions');
width=Dimensions.get('window').width;
height=Dimensions.get('window').height;

//export default class Report extends React.Component{
class ViewSubmittedReport extends React.Component{
	static navigationOptions = {
		title: "Report",
	};

	constructor(props) {
		super(props);
		this.state = {
			switchValue: false,
			userid:null,
			authorityid:null,
			reportid:'-LR6NREnUrugm8gTKcEv',
			//reportid:this.props.navigation.state.params.keyPassed,
			type:'Reports',
			number_images:0,
			image: null,
			images: null,
			imagesshow:[],
			imageReturned: null,
			imagesReturned: [],
			publicSetting:'true',
			description:"empty",
			response:"Noted, thank you for your report",
			temporaryData:{description:"Loading..."},
			urlArray:null,
		}
	}

	//my version BACK HANDLER (ok for stack navigator)
	componentDidMount() {
		ReportRef=firebase.database().ref('Reports'+"/"+this.state.reportid);
		console.log("will mount")
		//console.log("will mount2",ReportRef)
		ReportData=ReportRef.once('value',(data)=> {
			console.log("entered Report Data")
			this.setState({temporaryData: data.toJSON()});
			/*
			//cannot console log, coz console log too fast
			console.log("data",temporaryData)
			console.log("after entered Report Data")
			console.log('temporaryData', this.state.temporaryData);
			console.log('description', this.state.temporaryData.description);
			console.log('response', this.state.temporaryData.response);
			console.log('imageURLs', this.state.temporaryData.imageURLs);
			console.log('imageURLs TYPE', typeof this.state.temporaryData.imageURLs);
			*/
			k=this.state.temporaryData.imageURLs;
			this.setState({urlArray: k});
			console.log('imageURLs loaded', this.state.urlArray);
		})
	}

	componentWillUnmount() {
	}

	toggleSwitch=(value)=>{
		this.setState({switchValue:value})
		console.log('Switch is :'+value)
	}



	updateDetails = async() => {
		console.log("entered")
		const detail ={
			"description" : this.state.description,
			"publicSetting" : this.state.publicSetting,
			"userid" : this.state.userid,
			"authorityid" : this.state.authorityid,
			"description" : this.state.description,
		}
		//format: saveReportDetails = (type,objectID,details)
		const ready = await saveReportDetails(this.state.type,this.state.reportid,detail).catch((error) => {console.log(error)})
		//console.log(ready)

	}

	updateResponse = async() => {
		console.log("updating Response")
		//format: const editReportDetails = (type,objectID,param,paramDetail) => {
		const ready = await editReportDetails(this.state.type,this.state.reportid,'response',this.state.response).catch((error) => {console.log(error)})
		//console.log(ready)

	}


	submitReport=()=>{
		this.updateDetails();

		if (this.state.number_images===0)
		{

		}
		else
		{
			for(var i=0; i<this.state.imageReturned.length;i++)
			{
				//the key = {i} below is needed because inside the array got 2 images, if they dont have unique key,
				//the DOM might mix them up
				//reference: second answer in https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js

				//format:uploadPhoto = (image, key,type, objectID)
				uploadPhoto(this.state.imageReturned[i],i,thisred.state.type, this.state.reportid)
			}
		}
	}

	submitResponse=()=>{
		this.updateResponse();

	}

	myCallback=(dataPassed,dataPassed2)=>{
		console.log("dataPassed",dataPassed)
		console.log("dataPassed2",dataPassed2)
		this.setState({imageReturned: dataPassed})
		this.setState({number_images: dataPassed2})
	}
	DescriptionCallback=(dataPassed)=>{
		//console.log("Description",dataPassed)
		this.setState({description: dataPassed})
	}
	ResponseCallback=(dataPassed)=>{
		this.setState({response: dataPassed})
	}

	renderImages(URLarrayPassed) {
		console.log("URL loaded 123",URLarrayPassed)
		if (URLarrayPassed)
		{
			arraylength= Object.keys(URLarrayPassed).length;
			console.log("arraylength",arraylength)
			console.log("imagesshow length",this.state.imagesshow.length)
			for(var i=0; i<arraylength;i++)
			{
				this.state.imagesshow.push(<Image key={i} style={styles.imagesStyle} source={{ uri:URLarrayPassed[i]}} />)
			}
			console.log("return imagesshow");
			return this.state.imagesshow;
		}
		else
		{
			//this if else is needed because the loading of this.state.temporaryData.imageURLs is slower than render
			return <Text>No image</Text>
		}
		//the error is because the loading of this.state.temporaryData.imageURLs is slower
		//return <Image style={styles.imagesStyle} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/tglproject1234-dfcd3.appspot.com/o/Reports%2FunspecifiedReportID2%2F15357274240000.jpg?alt=media&token=19d0d028-5d98-406f-b4d7-82b2cc355341' }} />
	}

	//backup
	//{this.state.temporaryData.imageURLs ? this.renderImages(this.state.temporaryData.imageURLs) : null}
	//{this.state.temporaryData.imageURLs ? this.renderImages(this.state.temporaryData.imageURLs) : <Text>No image</Text>}
	//{this.renderImages(this.state.temporaryData.imageURLs)}
	render(){
		//{this.state.urlArray ? this.renderImages(this.state.urlArray) : <Text>No image</Text>}
		return(
			<View>
			<ScrollView contentContainerStyle={styles.container}>

				<View style={styles.title_box}>
						<Text style={{color:'black', marginTop:10}}>Title:</Text>
						<Text>{this.state.temporaryData.title}</Text>
					</View>


				<Text style={{color:'black'}}>Description of Report</Text>
				<View style={styles.D_box}>
					<Text>{this.state.temporaryData.description}</Text>
				</View>
				<View style={styles.photoBox}>
					<ScrollView contentContainerStyle={styles.scrollImageContainer}>
						{this.state.urlArray ? this.renderImages(this.state.urlArray) : <Text>No image</Text>}
					</ScrollView>
				</View>
				<View style={styles.contentBoxes}>
					<Text style={{color:'black'}}>Location</Text>
					<Text style={{color:'black'}}> {this.state.temporaryData.location}</Text>
				</View>
				<View style={styles.setting_box}>
					<Text textAlign={'left'} style={styles.settingText}>Authority</Text>
					<Text textAlign={'left'} style={styles.settingText}>{this.state.temporaryData.authorityName}</Text>
				</View>
				<View style={styles.setting_box}>
					<Text textAlign={'left'} style={styles.settingText}>Public</Text>
					<Switch
						value={this.state.temporaryData.publicSetting}
					/>
				</View>
				<Text>Response from Authority</Text>
				<View style={styles.D_box}>
					<Text>{this.state.temporaryData.response}</Text>
				</View>
			</ScrollView>
			</View>
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

export default ViewSubmittedReport;

const styles=StyleSheet.create({
	container:{
		//scrollView cannot put flex:1
		alignItems:'flex-start',
		//justifyContent: 'center',
		//backgroundColor: '#999'
	},
	text:{
		fontSize: 20,
		color: '#fff',
		marginLeft: 10,
	},
	title_box:{
		flex:1,
		marginTop:15,
		flexDirection: 'column',
		alignSelf:'stretch',
		marginBottom:5,
		marginLeft:10,
		marginRight:2,
		//alignItems: 'flex-start',
		//justifyContent:'space-between',
		backgroundColor: 'rgba(360,360,360,1)'
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
	ImageContainer:{
		flex:1,
		alignSelf: 'stretch',
		flexDirection:'row',
	},
	scrollImageContainer:{
		alignSelf: 'stretch',
		justifyContent:'center',
		alignItems:'center',
		flexDirection:'column',
	},
	imagesStyle:{
		width:200,
		height:200,
		resizeMode: 'contain',
		marginBottom:2,
		marginTop:2,
	},
	verticalContainer:{
		flexDirection:'column',
		justifyContent:'center',
		alignItems:'center',
		borderWidth:2,
		alignSelf: 'stretch',
		width:40,
	},
});
