import React, { Component } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

class CustomTextInput extends Component {
  render() {
    return (
      <TextInput
        {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
        editable = {true}
        maxLength = {500}
		underlineColorAndroid='transparent'
      />
    );
  }
}

export default class CustomTextInputMultiline extends Component {
  constructor(props) {
    super(props);
	if (this.props.placeholder===undefined)
	{
		this.state = {
			text: ''
		};
	}
    else{
		this.state = {
			text: this.props.placeholder,
		};
	}
	//console.log('placeholder',this.props.placeholder);
  }

  // If you type something in the text box that is a color, the background will change to that
  // color.
  render() {

    return (
     <View style={styles.textStyle}
     >
       <CustomTextInput
         multiline = {true}
         numberOfLines = {10}
         onChangeText={(text) =>
			 {
				 this.setState({text})
				 this.props.callbackFromParent(this.state.text);
			 }
		}
		placeholder='Type something here'
         value={this.state.text}
       />
     </View>
    );
  }
}


const styles=StyleSheet.create({
	textStyle:{
		flexDirection:'row',
		backgroundColor: '#rgba(360,360,360,1)'
	},
})
