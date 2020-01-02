import React, { useState, useEffect } from 'react'
import { View, Image, Slider, ActivityIndicator } from 'react-native'
import {
  Button,
  Text,
  Card,
  List,
  ListItem,
  Icon,
  Input
} from '@ui-kitten/components'
// import Slider from 'react-native-slider'
import styled from 'styled-components'
import { useHistory } from 'react-router-native'

const Wrapper = styled.View`
  margin-top: 10px;
`

const NytSoi = styled.Text`
  font-size: 28px;
  margin-left: 10px;
  margin-bottom: 4px;
`
const Controls = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

function SongControl({ socket, guild, auth }) {
  const [playing, setPlaying] = useState({})
  const [volume, setVolume] = useState(1)
  const [disabled, setDisabled] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [videos, setVideos] = useState([])
  const [info, setInfo] = useState([])
  const history = useHistory()

  const queue = playing.queue || []
  const id = guild.id

  useEffect(() => {
    socket.emit('getNowPlaying', { id })

    const loop = setInterval(() => {
      socket.emit('getNowPlaying', { id })
    }, 3000)

    socket.on('nowPlaying', state => {
      if (state.queue[0]) {
        setPlaying(state)
      } else {
        setPlaying({})
      }
    })

    socket.on('log', arr => {
      showInfo(arr)
    })

    socket.on('GOT_VIDEOS', data => {
      setLoading(false)
      if (data.error) return showInfo(['Error:', data.error])

      setVideos(data.videos)
    })

    socket.on('ADDED_VIDEO_QUEUE', data => {
      console.log(data)
      if (data.error) return showInfo(['Error:', data.errorMessage])
      setVideos([])
      setSearch('')
      showInfo(['Info:', 'Musa lisätty queueen'])
    })

    return () => {
      clearInterval(loop)

      socket.removeListener('nowPlaying')
      socket.removeListener('log')
      socket.removeListener('ADDED_VIDEO_QUEUE')
      socket.removeListener('GOT_VIDEOS')
    }
  }, [id, socket])

  function showInfo(arr) {
    setInfo(arr)
    setTimeout(() => {
      setInfo([])
    }, 3500)
  }

  function handleStop() {
    socket.emit('leave', { id })
    setPlaying({})
  }

  function handlePausePlay() {
    if (playing.playing) {
      setPlaying({ ...playing, playing: false })
      socket.emit('pause', { id })
    } else {
      setPlaying({ ...playing, playing: true })
      socket.emit('play', { id })
    }
  }

  function handleSkip() {
    socket.emit('skip', {
      block: false,
      id
    })
  }

  function handleVolume() {
    showInfo(['Voluumi:', volume])
    socket.emit('setVolume', {
      id,
      volume
    })
  }

  function handleLastMusic() {
    setDisabled(true)
    const queueData = {
      auth,
      guildId: id
    }
    socket.emit('playLatestMusic', queueData)
    setTimeout(() => {
      setDisabled(false)
    }, 2500)
  }

  function handleSearch() {
    if (!search) return showInfo(['Info', 'Hae ny jotain edes'])
    setLoading(true)
    socket.emit('SEARCH_VIDEOS', {
      data: { auth, guildId: id },
      searchTerm: search
    })
  }

  function handlePlayVideo(video) {
    setVideos([])

    const queueData = {
      auth,
      video,
      guildId: id
    }
    socket.emit('ADD_VIDEO_QUEUE', queueData)
  }

  const queueList = [...queue].filter((_, i) => i >= 1)
  return (
    <Wrapper>
      {info[0] && (
        <Card style={{ marginBottom: 15, marginTop: 15 }} status="info">
          <Text>
            {info[0]} {info[1]}
          </Text>
        </Card>
      )}
      {queue[0] ? (
        <NytSoi>Nyt soi</NytSoi>
      ) : (
        <NytSoi style={{ textAlign: 'center' }}>Mitään ei soi :(</NytSoi>
      )}

      {queue[0] && (
        <View>
          <Card
            header={() => (
              <View>
                <Image
                  style={{ width: '100%', height: 200 }}
                  source={{
                    uri: queue[0].thumbnail
                  }}
                />
              </View>
            )}
            style={{ marginBottom: 10 }}
            key={queue[0].id}>
            <Text>{queue[0].title}</Text>
          </Card>
          <Controls style={{ marginBottom: 10 }}>
            <Button
              appearance="ghost"
              style={{ width: 45, marginLeft: 10 }}
              onPress={handleStop}
              icon={() => <Icon name="stop-circle-outline" />}
            />

            {playing.playing ? (
              <Button
                appearance="ghost"
                style={{ width: 45 }}
                onPress={handlePausePlay}
                icon={() => <Icon name="pause-circle-outline" />}
              />
            ) : (
              <Button
                appearance="ghost"
                style={{ width: 45 }}
                onPress={handlePausePlay}
                icon={() => <Icon name="play-circle-outline" />}
              />
            )}
            <Button
              appearance="ghost"
              style={{ width: 45 }}
              onPress={handleSkip}
              icon={() => <Icon name="skip-forward-outline" />}
            />

            <View
              style={{
                flex: 1,
                alignItems: 'stretch',
                justifyContent: 'center'
              }}>
              <Slider
                step={1}
                minimumValue={1}
                maximumValue={35}
                onSlidingComplete={handleVolume}
                onValueChange={value => setVolume(parseFloat(value))}
                value={volume}
              />
            </View>
          </Controls>
        </View>
      )}

      {queue[1] && (
        <View>
          <NytSoi>Queue:</NytSoi>
          <List
            data={queueList}
            renderItem={({ item }) => <ListItem title={item.title} />}
          />
        </View>
      )}

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 5 }}
          size="large"
          color="#0000ff"
        />
      ) : (
        <Input
          style={{ marginLeft: 10, marginRight: 10, marginTop: 5 }}
          placeholder="Hae videoita"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
      )}
      {videos.map(video => (
        <Card onPress={() => handlePlayVideo(video)} key={video.id}>
          <Text>{video.title}</Text>
        </Card>
      ))}

      <Controls style={{ marginTop: 20, marginBottom: 20 }}>
        <Button appearance="ghost" onPress={() => history.push('/')}>
          Takaisin
        </Button>
        <Button
          appearance="ghost"
          disabled={disabled}
          onPress={handleLastMusic}>
          Soita viimeisin musa
        </Button>
      </Controls>

      {/* {queue.map((song, i) => {
        if (i == 0) return
        return (
          <Card key={song.id}>
            <Text>{song.title}</Text>
          </Card>
        )
      })} */}
    </Wrapper>
  )
}

export default SongControl
