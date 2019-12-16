import React from 'react'
import { Button, StyleSheet, View, Platform, AsyncStorage } from 'react-native'
import { NativeRouter, Route, Link } from 'react-router-native'

import { ApplicationProvider, Layout, Text } from '@ui-kitten/components'
import { mapping, light as lightTheme } from '@eva-design/eva'

import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks'

import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'

import apolloLogger from 'apollo-link-logger'

import Auth from './components/Auth'
import Panel from './components/Panel'

const cache = new InMemoryCache()
const httpLink = new createHttpLink({
  uri: 'https://jeffe.co/graphql',
  credentials: 'include'
})

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('sid')
  console.log('REQ')

  return {
    ...headers,
    headers: {
      Cookie: token ? `connect.sid=${token};sid=${token}` : null
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache
})

client.resetStore()

const App = () => (
  <ApplicationProvider mapping={mapping} theme={lightTheme}>
    <ApolloProvider client={client}>
      <NativeRouter>
        <Route exact path="/" component={Auth} />
        <Route path="/panel/:id" component={Panel} />
      </NativeRouter>
    </ApolloProvider>
  </ApplicationProvider>
)

export default App
