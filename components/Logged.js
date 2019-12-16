import React, { useState, useEffect } from 'react'
import { Button, StyleSheet, View, Platform, Image } from 'react-native'
import { useHistory } from 'react-router-native'
import styled from 'styled-components'
import { Card, Text } from '@ui-kitten/components'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

import Jeffe from '../assets/jeffe.png'
const Kortti = styled(Card)`
  max-width: 90%;
  width: 100%;
  margin: 0 auto;
  margin-top: 10px;

  box-shadow: 0px 8px 20px rgba(218, 224, 235, 0.6);
`
const Username = styled.Text`
  font-size: 44px;
  margin: 0 auto;
`
const Grid = styled.View`
  display: flex;
  flex-direction: column;
`
const Wrapper = styled.View`
  margin-top: 25px;
`

const GET_USER = gql`
  {
    user {
      username
    }

    guilds {
      name
      id
      botInServer
    }
  }
`

function Logged(props) {
  const history = useHistory()
  const { loading, error, data } = useQuery(GET_USER)

  if (loading)
    return (
      <Wrapper>
        <Text>Loading...</Text>
      </Wrapper>
    )
  if (error) {
    return (
      <Wrapper>
        <Text>Error! ${error.message}</Text>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      {/* <Image source={Jeffe} /> */}
      <Username>{data.user.username}</Username>

      <Grid>
        {data.guilds.map(guild => {
          if (!guild.botInServer) return
          return (
            <Kortti
              onPress={() => {
                history.push(`/panel/${guild.id}`)
              }}
              key={guild.id}>
              <Text>{guild.name}</Text>
            </Kortti>
          )
        })}
      </Grid>
    </Wrapper>
  )
}

export default Logged
