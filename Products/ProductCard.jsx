import React from 'react'
import { Text, Dimensions } from 'react-native'
import { ScrollView} from 'native-base'
import products from '../Data/Data'


const {width} = Dimensions.get('window')
const HomeProduct = () => {

  return (
  <ScrollView flex={1} show={false} >
   
    
       {products.map((item)=>(
            <TouchableOpacity 

          key={item.id}
           >
          
           
            <Text style={{fontWeight:300}} >
            {item.name}
            </Text>
            <Text style={{fontSize:20}} >
               Gh₵{item.price}
            </Text>
           
        
           
       
           </TouchableOpacity>
        ))
        }
    

    


  </ScrollView>
  )
}

export default HomeProduct
