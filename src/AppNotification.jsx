import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'


const AppNotification = ({type, text}) => {

    const height = useRef(new Animated.Value(0)).current

    useEffect(()=>{
        Animated.timing(height, {
            toValue: 40,
            duration: 2000,
            useNativeDriver: false
        }).start()
    }, [])

    // const backgroundColor = type === 'error'? 'rgba(255, 0,0,0.7)': 'rgba(0,255,0,0.7)'


  return (
    <Animated.View style={[styles.container, {height}]} >
     <Text 
     style={{color: 'red'}} 
     >{text}</Text>
    </Animated.View>
  )
}

export default AppNotification

const styles = StyleSheet.create({
    container:{
        justifyContent:"center",
        paddingHorizontal: 15,
        top:10,
       
    }
})