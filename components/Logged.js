import React from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import { useHistory } from 'react-router-native'
import styled from 'styled-components'
import { Card, Text, Button } from '@ui-kitten/components'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

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
  font-weight: 700;
`
const Grid = styled.View`
  display: flex;
  flex-direction: column;
`
const Wrapper = styled(ScrollView)`
  margin-top: 35px;
`
const Notifce = styled.Text`
  opacity: 0.2;
  margin-top: 100%;
  text-align: center;
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
  const { loading, error, data } = useQuery(GET_USER, {
    fetchPolicy: 'no-cache'
  })
  if (loading)
    return (
      <ActivityIndicator
        style={{ marginTop: 45 }}
        size="large"
        color="#0000ff"
      />
    )
  if (error) {
    return (
      <Wrapper>
        <Text>Error! ${error.message}</Text>

        <Text>Kannattaa koittaa kirjautua ulos ja takaisin sisään</Text>

        <Button onPress={() => props.logout()}>Kirjaudu ulos</Button>
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

      <Button
        style={{ marginTop: 20 }}
        appearance="ghost"
        onPress={() => props.logout()}>
        Kirjaudu ulos
      </Button>

      <Notifce>JEFFe Mobiili BETA © 2020 JEFFe</Notifce>
    </Wrapper>
  )
}

export default Logged
