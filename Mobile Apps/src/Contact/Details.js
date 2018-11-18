import React from 'react';
import { ScrollView, StyleSheet, Text, View, Alert, Image, BackHandler } from 'react-native';

import { Tile, List, ListItem , Button,} from 'react-native-elements';

import styles from '../tabs/styles'
import * as firebase from 'firebase'

class Details extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    headerStyle:{backgroundColor:'transparent'},
  }

  constructor(props){
    super(props);
    this.state ={currentState: 'Page',}
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
  )
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate("Contact")
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  onChat (){
    console.log("Report Page")
  }

  onSentReport (){
    console.log("Report Page")
  }

  onCall(){
    const { picture, name, email, phone, login, dob, location } = this.props.navigation.state.params;
    console.log("calling " + phone)
  }

  render() {
    const { picture, name, email, phone, login, dob, location } = this.props.navigation.state.params;

    return (
      <ScrollView>
        <Tile
          imageSrc={{ uri: picture.large}}
          featured
          title={`${name.first.toUpperCase()} ${name.last.toUpperCase()}`}
          caption={email}
        />

        <List>
          <ListItem
            title="Email"
            rightTitle={email}
            hideChevron
          />
          <ListItem
            title="Phone"
            rightTitle={phone}
            hideChevron
          />
          <ListItem
            title="Address"
            rightTitle={' '}
            hideChevron
          />
        </List>

        <List>
          <ListItem
            title="Username"
            rightTitle={login.username}
            hideChevron
          />
        </List>

        <List>
          <ListItem
            title="Last Active"
            rightTitle={' '}
            hideChevron
          />
          <ListItem
            title="City"
            rightTitle={location.city}
            hideChevron
          />
        </List>

        <Button
          title="Sent Report to this Authority"
          buttonStyle={{ marginTop: 20 }}
            onPress={this.onSentReport.bind(this)}
        />

        <Button
          title="Chat"
          buttonStyle={{ marginTop: 20 }}
            onPress={this.onChat.bind(this)}
        />

        <Button
          title="Call Authority"
          buttonStyle={{ marginTop: 5 , marginBottom: 15}}
            onPress={this.onCall.bind(this)}
        />

      </ScrollView>
    );
  }
}

export default Details;
