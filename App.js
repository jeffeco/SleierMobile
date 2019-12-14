import React from 'react'
import { Button, StyleSheet, Text, View, Platform } from 'react-native'

import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';

import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

import Auth from './components/Auth'

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'https://jeffe.co/graphql'
});

const client = new ApolloClient({
  cache,
  link,
  credentials: "include"
});

const App = () => (
  <ApolloProvider client={client}>
    <Auth />
  </ApolloProvider>
);

export default App
