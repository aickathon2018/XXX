import React from 'react';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,119,26,1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText:{
    fontSize: 10,
    color:'rgba(255,255,255,0.6)',
    marginVertical:0,
  },
  loginLogo:{
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  modalContainer:{
    alignItems: 'center',
    height: 240,
    width: 280,
    borderRadius: 20,
    shadowRadius:10,
  },
  modalContainerAtDetails:{
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: 280,
    borderRadius: 20,
    shadowRadius:10,
  },
  modalContainerUserid:{
    alignItems: 'center',
    justifyContent: 'center',
    height: 350,
    width: 280,
    borderRadius: 20,
    shadowRadius:10,
  },
  modalContainer2:{
    alignItems: 'center',
    height: 270,
    width: 280,
    borderRadius: 20,
    shadowRadius:10,
  },
  inputContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    width: 300,
    paddingHorizontal: 20,
    color:'rgba(255,255,255,0.8)',
  },
  ModalInputContainer: {
    scaleX:0.65,
    alignItems: 'center',
  },
  ModalInput: {
    alignSelf: 'center',
    textAlign: 'center',
    scaleY:0.70,
    fontSize:24,
  },
  textContainer: {
    color:'rgba(255,255,255,0.4)',
    padding: 10,
    paddingTop: 15,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
  //  fontWeight: 700,
    color:'#718792',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
  //  fontSize: 16,
    backgroundColor:'#1c313a',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    padding:8,
    width: 90,
  },
  word: {
      color:'#1c313a',
      flexDirection: 'row',
      fontSize: 10,
    },
  signUpButtonText: {
    fontSize: 12,
    color:'#718792',
    alignItems: 'center',
    justifyContent: 'center',
  },

});

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/

export default styles;
