import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import {Icon} from 'react-native-elements';


export default class VideoItem extends React.Component {
    render() {
    let video = this.props.video;
	return(
			<View style={styles.border}>
				<View style={styles.descContainer}>
					<Image source={{ uri: video.snippet.channelProfile }} style={{marginTop:-5, width:40, height: 40, borderRadius:25 }} />
					<View style={styles.videoDetails}>
						<Text style={styles.channelTitleText}>{video.snippet.channelTitle}</Text>
					</View>
					<TouchableOpacity>
                        <Icon style={{marginTop:-3}} name="more-vert" size={20} color="#999999"/>
                    </TouchableOpacity>
				</View>
				<Image source={{ uri: video.snippet.thumbnails.medium.url }} style={{  height: 200 }} />
				<View style={styles.descContainer2}>
					<View style={styles.videoDetails}>
						<Text numberOfLines={5} style={styles.videoTitle}>{video.snippet.description}</Text>
						<Text style={styles.videoStats}>{video.snippet.timeAgo}</Text>
					</View>
				</View>
			</View>
	)
	}
}

function nFormatter(num, digits) {
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol + ' views';
}


const styles = StyleSheet.create({
  container: {
    padding:15
  },
  border:{

  },
  descContainer:{
	  flexDirection:'row',
	  paddingTop:15,
	  paddingLeft:5,
	  marginBottom:3,
	  backgroundColor: 'white',
	  justifyContent:'center',
	  alignItems: 'center',
  },
  descContainer2:{
	  flexDirection:'row',
	  paddingTop:15,
	  paddingLeft:5,
	  marginBottom:3,
  },
  videoTitle:{
	  fontSize:16
  },
  videoDetails:{
	  flex:1,
	  paddingHorizontal:14,
	  marginTop:-10 //marginTop negative can be used to adjust the position
  },
  videoStats: {
      fontSize: 14,
      paddingTop: 3,
	  color:"#3c3c3c"
  },
  channelTitleText: {
      fontSize: 24,
      paddingTop: 3,
	  color:"#3c3c3c"
  }
});
