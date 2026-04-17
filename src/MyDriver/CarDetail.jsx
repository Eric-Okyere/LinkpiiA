import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native'

const CarDetail = () => {
  return (
    <View>
      <Text>This is your Car detail</Text>

      <Image mt={10} source={{ uri: item.carpic }} />
      <Image mt={10} source={{ uri: item.deriverpic }} />
    </View>
  )
}

export default CarDetail

const styles = StyleSheet.create({})