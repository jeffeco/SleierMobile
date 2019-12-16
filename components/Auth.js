import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  View,
  Platform,
  AsyncStorage
} from 'react-native'
import { AuthSession, Linking } from 'expo'
import * as WebBrowser from 'expo-web-browser'

import Logged from './Logged'
export default class Login extends React.Component {
  state = {
    authResult: {}
  }

  async componentDidMount() {
    const value = await AsyncStorage.getItem('sid')
    if (value) {
      console.log(value, 'auth')
      this.setState({ authResult: { type: 'success' } })
    }
  }

  render() {
    if (
      this.state.authResult.type &&
      this.state.authResult.type === 'success'
    ) {
      return (
        <View>
          {/* eslint-disable-next-line react/jsx-handler-names */}
          <Logged />
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Button title="Kirjaudu sisään" onPress={this.handleOAuthLogin} />
        </View>
      )
    }
  }

  handleRedirect = async ({ url }) => {
    console.log(url)
    if (url.split('?')[1]) {
      const sid = url.split('?')[1].split('=')[1]
      await AsyncStorage.setItem('sid', sid)
    }
    if (Platform.OS === 'ios') {
      WebBrowser.dismissBrowser()
    }
  }

  handleOAuthLogin = async () => {
    // gets the app's deep link
    const redirectUrl = await Linking.getInitialURL()
    const backUrl = await Linking.makeUrl()

    // this should change depending on where the server is running
    this.addLinkingListener()
    try {
      const authResult = await WebBrowser.openAuthSessionAsync(
        `https://jeffe.co/auth/discord?deeplink=${backUrl}`,
        redirectUrl
      )
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
    justifyContent: 'center'
  }
})
