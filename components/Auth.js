import React from 'react'
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Platform,
  AsyncStorage,
  Image
} from 'react-native'
import { Linking } from 'expo'
import * as WebBrowser from 'expo-web-browser'
import Logo from '../assets/jeffe.png'
import styled from 'styled-components'

import { server } from './../config.json'
import Logged from './Logged'

import { Button, Card, CardHeader, Text } from '@ui-kitten/components'
const Notifce = styled.Text`
  opacity: 0.2;
  margin-top: 100%;
  text-align: center;
`

const Header = () => (
  <CardHeader title="Sleier beta" description="Mobiiliversio" />
)

export default class Login extends React.Component {
  state = {
    authResult: { type: 'loading' }
  }

  async componentDidMount() {
    const value = await AsyncStorage.getItem('sid')
    if (value) {
      if (this.state.authResult.type == 'success') return
      this.setState({ authResult: { type: 'success' } })
    } else {
      if (this.state.authResult.type == 'kusi') return
      this.setState({ authResult: { type: 'kusi' } })
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
          <Logged
            logout={async () => {
              await AsyncStorage.clear()
              this.setState({ authResult: { type: 'not good' } })
              console.log('Cleared ')
            }}
          />
        </View>
      )
    } else if (
      this.state.authResult.type &&
      this.state.authResult.type === 'loading'
    ) {
      return (
        <ActivityIndicator
          style={{ marginTop: 45 }}
          size="large"
          color="#0000ff"
        />
      )
    } else {
      return (
        <View style={styles.container}>
          <View
            style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <Image style={{ width: 160, height: 34 }} source={Logo} />
          </View>

          <Card
            header={Header}
            footer={() => (
              <View style={styles.footerContainer}>
                <Button
                  onPress={this.handleOAuthLogin}
                  style={styles.footerControl}
                  size="small">
                  Kirjaudu sisään
                </Button>
              </View>
            )}>
            <Text>BETA TAI JOTAI</Text>
            <Text>Asiat jotka ei toimi / on bugisia:</Text>
            <Text>Kirjautuminen, voluumin vaihto ja musiikin lisääminen </Text>
          </Card>
          <Notifce>JEFFe Mobiili BETA © 2020 JEFFe</Notifce>
        </View>
      )
    }
  }

  handleRedirect = async ({ url }) => {
    if (url.split('?')[1]) {
      const sid = url.split('?')[1].split('=')[1]
      await AsyncStorage.setItem('sid', sid)
      this.setState({ authResult: { type: 'success' } })
      console.log('SID TALLESSA', sid)
    }
    if (Platform.OS === 'ios') {
      WebBrowser.dismissBrowser()
    }
  }

  handleOAuthLogin = async () => {
    // gets the app's deep link
    const redirectUrl = await Linking.getInitialURL()
    const backUrl = await Linking.makeUrl()

    console.log(redirectUrl, backUrl)
    // this should change depending on where the server is running
    this.addLinkingListener()
    try {
      await WebBrowser.openAuthSessionAsync(
        `${server}/auth/discord?deeplink=${backUrl}`,
        redirectUrl
      )
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
    marginTop: 45
  }
})
