import { View, Text } from 'react-native'
import React from 'react'

const Error = (props) => {
  return (
    <View>
      <Text style={{color:"red"}} >{props.message}</Text>
    </View>
  )
}

export default Error