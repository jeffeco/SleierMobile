import React, { useEffect, useState } from 'react'
import Counter from './Counter'

import { ActivityIndicator, View, Text } from 'react-native'
import { Button, Card } from '@ui-kitten/components'
import { useHistory } from 'react-router-native'

import styled from 'styled-components'

const ComputerCard = styled(Card)`
  && {
    border-radius: 12px;
    max-width: 1300px;

    display: flex;
    margin-top: 20px;

    @media only screen and (max-width: 1000px) {
      flex-direction: column;
    }
  }
`

const Stats = styled.View`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 1000px) {
    margin: 30px 0px;
  }
`

function Off({ socket }) {
  const [computer, setComputer] = useState({})
  const history = useHistory()

  useEffect(() => {
    socket.emit('web_GET_COMPUTERS')

    socket.on('web_COMPUTER_LIVE', data => {
      console.log(data)
      setComputer(data)
    })
    return () => {
      socket.removeListener('web_COMPUTER_LIVE')
    }
  }, [socket])

  function shutdown() {
    socket.emit('web_KILL_COMPUTER', 'juuso')
    setTimeout(() => {
      setComputer({})
      socket.emit('web_GET_COMPUTERS')
    }, 1500)
  }

  return (
    <View>
      {computer.name ? (
        <ComputerCard>
          <Stats>
            <Text>{computer.name}</Text>
            <Counter time={computer.uptime} />
            <View style={{ marginTop: 15 }}>
              <Button onClick={shutdown} variant="outlined">
                Sammuta kone
              </Button>
            </View>
          </Stats>
        </ComputerCard>
      ) : (
        <View>
          <ComputerCard>
            <ActivityIndicator
              style={{ marginTop: 45 }}
              size="large"
              color="#0000ff"
            />
          </ComputerCard>
          <View>
            <Text>
              Jos ei lataa nii voi olla että kaikki koneet ovat kiinni
            </Text>
          </View>
        </View>
      )}

      <Button onPress={history.push('/')}>Takaisin</Button>
    </View>
  )
}

export default React.memo(Off)
