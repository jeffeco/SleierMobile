import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'

function toHHMMSS(b) {
  var w = parseInt(b, 10) // don't forget the second param
  var hours = Math.floor(w / 3600)
  var minutes = Math.floor((w - hours * 3600) / 60)
  var seconds = w - hours * 3600 - minutes * 60

  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  var time = hours + ':' + minutes + ':' + seconds
  return time
}

function Counter(props) {
  const tim = toHHMMSS(props.time)
  const [time, setTime] = useState(tim)
  const [t, setT] = useState(props.time)

  useEffect(() => {
    const int = setInterval(() => {
      const su = t + 1
      setT(su)
      setTime(toHHMMSS(su))
    }, 1000)

    return () => {
      clearInterval(int)
    }
  })

  return <Text>Kone on ollut päällä: {time}</Text>
}

export default Counter
