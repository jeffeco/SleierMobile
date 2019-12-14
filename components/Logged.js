import React, {useState, useEffect} from 'react'
import { Button, StyleSheet, Text, View, Platform } from 'react-native'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks';

const GET_USER = gql`
  {
    user {
      username
    }
  }
`;

function Logged () {
  const { loading, error, data } = useQuery(GET_USER);

  if (loading) return <Text>'Loading...'</Text>;
  if (error) return <Text>`Error! ${error.message}`</Text>;

  console.log(data)

  return (
    <View>
      <Text>yeet</Text>
      <Text>{data.user.username}</Text>
    </View>
  )
}

export default Logged
