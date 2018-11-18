import React, {Component} from 'react';
import { ScrollView, RefreshControl, StyleSheet, Text, View, Alert, Image, TouchableOpacity, BackHandler, ActivityIndicator} from 'react-native';

import { Button } from 'react-native-elements';

import * as firebase from 'firebase'
import Modal from 'react-native-modalbox'

class AddModal extends React.Component {

  render(){
    return(
      <Modal
        style={{
          justifyContent:'center',
          shadowRadius: 10,
          width: 50,
          height:200,
        }}
        position='center'
        backdrop={true}
        onClose={() =>{
          alert("modal close")
        }}
        >
          <Text>Hello </Text>
      </Modal>
    )
  }
}

export default AddModal
