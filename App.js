import React from 'react'

import { AsyncStorage } from 'react-native'
import { NativeRouter, Route } from 'react-router-native'

import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { mapping, light as lightTheme } from '@eva-design/eva'

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'

import { EvaIconsPack } from '@ui-kitten/eva-icons'
import Auth from './components/Auth'
import Panel from './components/Panel'
import { server } from './config.json'

const client = new ApolloClient({
  uri: `${server}/graphql`,

  request: async operation => {
    const token = await AsyncStorage.getItem('sid')
    operation.setContext({
      headers: {
        Cookie: token ? `sid=${token}` : 'EIPÄ OLLU'
      }
    })
  }
})

const App = () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider mapping={mapping} theme={lightTheme}>
      <ApolloProvider client={client}>
        <NativeRouter>
          <Route exact path="/" component={Auth} />
          <Route path="/panel/:id" component={Panel} />
        </NativeRouter>
      </ApolloProvider>
    </ApplicationProvider>
  </>
)

export default App
