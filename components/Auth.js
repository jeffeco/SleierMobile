import React from 'react'
import { Button, StyleSheet, Text, View, Platform } from 'react-native'
import { AuthSession, Linking } from 'expo'
import * as WebBrowser from 'expo-web-browser'

import Logged from './Logged';
export default class Login extends React.Component {
  state = {
    authResult: {},
  };
  render() {
    if (this.state.authResult.type && this.state.authResult.type === 'success') {
      return (
        <View style={styles.container}>
          <Logged />
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Button title="Login with LinkedIn" onPress={this.handleOAuthLogin} />
        </View>
      )
    }
  }
  handleRedirect = async () => {
    if (Platform.OS === 'ios') {
      WebBrowser.dismissBrowser()
    }
  }
  handleOAuthLogin = async () => {
    // gets the app's deep link
    let redirectUrl = await Linking.getInitialURL()
    let backUrl = await Linking.makeUrl()

    // this should change depending on where the server is running
    this.addLinkingListener()
    try {
      let authResult = await WebBrowser.openAuthSessionAsync(`https://jeffe.co/auth/discord?deeplink=${backUrl}`, redirectUrl)
      await this.setState({ authResult: authResult })
    } catch (err) {
      console.log('ERROR:', err)
    }
    this.removeLinkingListener()
  }
  addLinkingListener = () => {
    Linking.addEventListener('url', this.handleRedirect)
  }
  removeLinkingListener = () => {
    Linking.removeEventListener('url', this.handleRedirect)
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
