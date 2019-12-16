import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Platform, Image } from 'react-native'
import styled from 'styled-components'
import { Button, Card, Text } from '@ui-kitten/components'
import { useHistory } from 'react-router-native'

import io from 'socket.io-client'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import SongControl from './SongControl'

const Wrapper = styled.View`
  margin-top: 25px;
`
const Username = styled.Text`
  font-size: 44px;
  margin: 0 auto;
`

const GET_GUILD = gql`
  query guild($id: String!) {
    guild(id: $id) {
      id
      name
      botInServer
      owner
      moderator
    }
  }
`

function Logged(props) {
  const [socket, setSocket] = useState({})
  const history = useHistory()
  const id = props.match.params.id
  const { loading, error, data } = useQuery(GET_GUILD, {
    variables: { id }
  })

  useEffect(() => {
    const socket = io('https://jeffe.co')
    setSocket(socket)
  }, [])

  if (loading) return <Text>'Loading...'</Text>
  if (error) return <Text>`Error! ${error.message}`</Text>

  return (
    <Wrapper>
      <Button onPress={() => history.push('/')}>Takaisin</Button>
      <Username>{data.guild.name}</Username>

      <Text>Ye</Text>

      <SongControl socket={socket} guild={data.guild} />

      <Text>{data.guild.name}</Text>
    </Wrapper>
  )
}

export default Logged
