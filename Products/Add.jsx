import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Center } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'




const Add = () => {
    const navigation = useNavigation()
    return (
        <View  >
            <Center >
                <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
                    <AntDesign name="camera"
                        // style={{ top: -30, left: 145, }}
                        size={54} color="black" />
                </TouchableOpacity>
            </Center>
        </View>
    )
}

export default Add