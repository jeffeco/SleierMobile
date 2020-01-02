import React from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import styled from 'styled-components'
import { Text } from '@ui-kitten/components'
import io from 'socket.io-client'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import SongControl from './SongControl'
const socket = io('http://192.168.8.100:80')

const Wrapper = styled.View`
  margin-top: 35px;
`
const Username = styled.Text`
  font-size: 44px;
  font-weight: 700;
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

    user {
      username
      id
    }
  }
`

function Logged(props) {
  const id = props.match.params.id
  const { loading, error, data } = useQuery(GET_GUILD, {
    variables: { id }
    // fetchPolicy: 'network-only'
  })

  if (loading)
    return (
      <ActivityIndicator
        style={{ marginTop: 45 }}
        size="large"
        color="#0000ff"
      />
    )
  if (error) return <Text>`Error! ${error.message}`</Text>

  return (
    <ScrollView>
      <Wrapper>
        <Username>{data.guild.name}</Username>

        {socket.connected && (
          <SongControl auth={data.user} socket={socket} guild={data.guild} />
        )}
      </Wrapper>
    </ScrollView>
  )
}

export default Logged
