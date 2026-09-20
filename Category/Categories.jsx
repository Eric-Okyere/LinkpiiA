import { Text, FlatList } from 'react-native'
import React from 'react'
import { ScrollView,List,View, Flex} from 'native-base'

import { TouchableOpacity } from 'react-native'

const categoryFilter = (props) => {
    const {categories} = props
  return (
    <>
    <ScrollView
     showsHorizontalScrollIndicator={false}
    horizontal={true}
    bounces={true}
    // 
    >
     
        <TouchableOpacity  
        key={1}
        onPress={()=>{
            props.categoryFilter('all'), props.setActive(-1)
        }}
        >
          
            <View style={{ height:30, margin:5,
                borderRadius:20,backgroundColor:"#07ed6b",width:80, padding:3
                }} >
                <Text numberOfLines={1} style={{color:"white",  fontWeight:"bold", fontSize:20}} >All</Text>
                </View>
           
        </TouchableOpacity>


  
        <FlatList   horizontal={true}
         data={categories} 
        renderItem={({item})=>{ 
          return ( 
          <TouchableOpacity
          onPress={()=>{ props.categoryFilter(item._id)
            props.setActive(props.categories.indexOf(item))
        }}
          >
            <View  style={{ height:30, margin:5,
                borderRadius:20,backgroundColor:"#07ed6b",width:80, padding:3, 
                }} >
                <Text numberOfLines={1} style={{color:"white",  fontWeight:"bold", fontSize:20}} >{item.name}</Text>
                </View>
                </TouchableOpacity>
          ) 
        }} 
         keyExtractor={(item)=>item.id} 
        /> 



    </ScrollView>

    </>
    )
}

export default categoryFilter