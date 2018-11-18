import React, {Component} from 'react';
import { ScrollView, RefreshControl, TextInput, StyleSheet, Text, View, Alert, Image, TouchableOpacity, BackHandler, ActivityIndicator} from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'

import * as firebase from 'firebase'
import Modal from 'react-native-modalbox'

class AccountDetails extends React.Component {

  constructor() {
      super();
      this.state = {
        isOpen: false,
        isDisabled: false,
        swipeToClose: true,
        sliderValue: 0.3,
        surname: ' ',
        firstName: ' ',
      };
    }

  _onNextPress = () =>{
      console.log("Next")
      this.refs.modalName.open()
  }

  onClose() {
   console.log('Modal just closed');
 }

 onOpen() {
   console.log('Modal just opened');
 }

 onClosingState(state) {
   console.log('the open/close of the swipeToClose just changed');
 }

  render(){
    return(
      <View style= {
      {  flex: 1,
        backgroundColor: '#455a64',
        alignItems: 'center',
        justifyContent: 'center',}
      }>
        <TouchableOpacity
          onPress={this._onNextPress}>
          <Text>Next</Text>
        </TouchableOpacity>

        <Modal
          style={[styles.modal, styles.modal1]}
          ref={"modal1"}
          swipeToClose={this.state.swipeToClose}
          onClosed={this.onClose}
          onOpened={this.onOpen}
          onClosingState={this.onClosingState}>
          <Text style={styles.text}>Basic modal</Text>
        </Modal>

        <Modal style={[styles.modal, styles.modal2]} backdrop={false}  position={"top"} ref={"modal2"}>
           <Text style={[styles.text, {color: "white"}]}>Modal on top</Text>

         </Modal>

         <Modal style={[styles.modal, styles.modal3]} position={"center"} backButtonClose={true} ref={"modalName"} isDisabled={this.state.isDisabled}>
           <Text style={styles.text}>Modal centered</Text>
           <FormLabel>First Name</FormLabel>
           <FormInput style={{  alignItems: 'center',}}
            onChangeText={firstName => this.setState({firstName})}/>

           <FormLabel>Surname</FormLabel>
           <FormInput onChangeText={surname => this.setState({surname})}/>

           <Button
              small
              icon={{name: 'squirrel', type: 'octicon', buttonStyle: styles.someButtonStyle }}
              title='Confirm' />
         </Modal>

         <Modal style={[styles.modal, styles.modal4]} position={"bottom"} ref={"modal4"}>
           <Text style={styles.text}>Modal on bottom with backdrop</Text>
         </Modal>

         <Modal isOpen={this.state.isOpen} ref={"modal5"} onClosed={() => this.setState({isOpen: false})} style={[styles.modal, styles.modal4]} position={"center"} >
           <Text style={styles.text}>Modal with backdrop content</Text>
         </Modal>

         <Modal style={[styles.modal, styles.modal4]} position={"bottom"} ref={"modal6"} swipeArea={20}>
           <ScrollView>
             <View style={{width: 300, paddingLeft: 10}}>
               <Text> Testing </Text>
             </View>
           </ScrollView>
         </Modal>

         <Modal ref={"modal7"} style={[styles.modal, styles.modal4]} position={"center"}>
           <View>
             <TextInput style={{height: 50, width: 200, backgroundColor: '#DDDDDD'}}/>
           </View>
         </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({

  wrapper: {
    paddingTop: 50,
    flex: 1
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  modal2: {
    height: 230,
    backgroundColor: "#3B5998"
  },

  modal3: {
    height: 300,
    width: 300
  },

  modal4: {
    height: 300
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },

  text: {
    color: "black",
    fontSize: 22
  }

});

export default AccountDetails
