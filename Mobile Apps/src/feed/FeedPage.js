import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, TouchableOpacity,FlatList} from 'react-native';
import { createStackNavigator, createBottomTabNavigator} from "react-navigation";
import {Icon} from 'react-native-elements';
import VideoItem from './videoItem';
import data from './data.json';


/*
 //remove
 <View style={styles.rightNav}>
						<TouchableOpacity>
							<Icon style={styles.navItem} name="search" size={25}/>
						</TouchableOpacity>
						<TouchableOpacity>
							<Icon style={styles.navItem} name="account-circle" size={25}/>
						</TouchableOpacity>
					</View>

 <View style={styles.tabBar}>
					<TouchableOpacity style={styles.tabItem}>
						<Icon  name="home" size={25}/>
						<Text style={styles.tabTitle}>Home</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.tabItem}>
						<Icon  name="whatshot" size={25}/>
						<Text style={styles.tabTitle}>Trending</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.tabItem}>
						<Icon  name="subscriptions" size={25}/>
						<Text style={styles.tabTitle}>Subscriptions</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.tabItem}>
						<Icon  name="folder" size={25}/>
						<Text style={styles.tabTitle}>Library</Text>
					</TouchableOpacity>
				</View>
*/

export default class FeedPage extends React.Component{

	static navigationOptions = {
    tabBarLabel: "Feeds",
    tabBarIcon: ({tintColor}) => (
      <Image
        source = {require('../../icons/book.png')}
        style = {{width:18, height:18, tintColor: tintColor}}>
      </Image>
    )
  }

	render(){
		return(
			<View style = {styles.container}>
				<View style = {styles.navBar}>
					<Text style={styles.topBarText}>Feeds</Text>

				</View>

				<View style={styles.body}>
					 <FlatList
					 data={data.items}
					 renderItem={(video)=><VideoItem video={video.item} />}
					 keyExtractor={(item)=>item.id}
					 ItemSeparatorComponent={()=><View style={{height:0.5,backgroundColor:'#E5E5E5'}}/>}
					 />
				</View>



			</View>
		);
	}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBarText:{
	fontSize:35,
	color: '#3c3c3c',
	paddingTop:2
  },
  navBar:{
	  height: 55,
	  backgroundColor: 'white',
	  elevation:3, //to produce the 3D view
	  paddingHorizontal:15,
	  flexDirection: 'row',
	  alignItems: 'center',
	  justifyContent: 'space-between'
  },
  rightNav: {
	  flexDirection: 'row'
  },
  navItem:{
	  marginLeft:25
  },
  tabBar:{
	  backgroundColor: 'white',
	  height:60,
	  borderTopWidth: 0.5,
	  borderColor: '#E5E5E5',
	  flexDirection: 'row',
	  justifyContent: 'space-around'

  },
  body:{
	  flex:1,
  },
  tabItem:{
	  alignItems: 'center',
	  justifyContent: 'center'
  },
  tabTitle:{
	  fontSize:11,
	  color: '#3c3c3c',
	  paddingTop: 4
  }
});
