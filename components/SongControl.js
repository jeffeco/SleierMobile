import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Platform, Image } from 'react-native'
import { Button, Card, Text } from '@ui-kitten/components'

import styled from 'styled-components'

const Wrapper = styled.View`
  margin-top: 25px;
`

function SongControl({ socket, guild }) {
  const id = guild.id

  useEffect(() => {
    socket.emit('getNowPlaying', { id })
    socket.on('nowPlaying', state => {
      console.log(state)
    })
  }, [id, socket])
  return (
    <Wrapper>
      <Text>Musiikki</Text>
    </Wrapper>
  )
}

export default SongControl
