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
import {Icon} from 'react-native-elements';
import PinLocation from './PinLocation';

class PinLocationBoxScreen extends React.Component{

	constructor(props){
		super(props)
		//If you want to use this.props in the constructor, you need to pass props to super
		this.state={
			loading:false,
			locationPinned:false,
			latitude:null,
			longitude:null,
			address:null,
		}

	}

	render(){
		//note that the ? is for if else state
		const pinned=this.state.locationPinned ?
			(<View style={styles.contentBoxes}>
				<Text style={{color:'black'}}>Location</Text>
				<Text>Latitude: {this.state.latitude}</Text>
				<Text>Longitude: {this.state.longitude}</Text>
				<Text>Address: {this.state.address}</Text>
				<Button onPress={()=>this.props.navigation.navigate('PinLocationScreen')} title={"Pin Point"} />
			</View>)
			:
			(
			<View style={styles.contentBoxes}>
				<Text style={{color:'black'}}>Location</Text>
				<Text>Latitude: {this.state.latitude}</Text>
				<Text>Longitude: {this.state.longitude}</Text>
				<Text>Address: {this.state.address}</Text>
				<Button onPress={()=>this.props.navigation.navigate('PinLocationScreen')} title={"Pin Point"} />
			</View>
			)

		return(

			<View style={styles.ImageContainer}>
				{pinned}
			</View>

		);
	}
}

const PinLocationBox = createStackNavigator(
{
	PinLocationBoxScreen: {screen: PinLocationBoxScreen},
	PinLocationScreen: { screen: PinLocation },

},
{
	headerMode:'None'
}
);

export default PinLocationBox;

const styles=StyleSheet.create({
	container:{
		flex:1,
		alignItems:'center',
		justifyContent: 'center',
		backgroundColor: '#999'
	},
	contentBoxes:{
		flexDirection:'column',
		alignSelf:'stretch',
		marginBottom:5,
		marginLeft:2,
		marginRight:2,
		alignItems:'center',
		justifyContent:'center',
		backgroundColor: 'rgba(360,360,360,1)',
		height: 180
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
		borderWidth:3,
		alignSelf:'stretch'
	},
	imagesStyle:{
		width:200,
		height:200,
		resizeMode: 'contain',
		marginBottom:2,
		marginTop:2,
	},
});
