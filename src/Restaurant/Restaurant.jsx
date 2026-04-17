import React, { useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  FlatList, Text,  Pressable, Image,
  BackHandler,
} from "react-native";
import { AntDesign, Entypo, EvilIcons } from "@expo/vector-icons";
import {
  HStack
} from "native-base";
import SearchProducts from "./Search";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../assets/common/BaseUrl";
import Categories from "./Categories";
import { useFocusEffect } from "@react-navigation/native";
import { format } from "date-fns";




var {height, width} = Dimensions.get("window");
const Restaurant = (props) => {
  const [products, setProducts] = useState([]);
  const [productFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState(false);
  // const [input, setInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [productCtg, setProductCtg] = useState([]);
  const [active, setActive] = useState(false);
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [displayedProducts, setDisplayedProducts] = useState(16); 
  const navigation = useNavigation();
 const PRODUCTS_PER_PAGE = 16;
  const [showSearch, setShowSearch] = useState(false);
  const [pressLoading, setPressLoading] = useState(false);
  const [input, setInput] = useState({ name: "", region: "" });
  const [showSearchbut, setShowSearchbut] = useState(true); 
  const [columns, setColumns] = useState([[], [], []]);
   const [page, setPage] = useState(1);
   const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);


  const ITEM_MARGIN = 10;
const NUM_COLUMNS = 3;
const COLUMN_WIDTH = (width - (NUM_COLUMNS + 1) * ITEM_MARGIN) / NUM_COLUMNS;

  
useEffect(() => {
  const backAction = () => {
    navigation.goBack();   // 👈 Take user back
    return true;           // prevent default behavior
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();
}, []);


  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const productsResponse = await fetch(`${baseURL}food/approved`);
          const productsData = await productsResponse.json();
          setProducts(productsData);
          setProductsFiltered(productsData);
          setProductCtg(productsData);
          setInitialState(productsData);
          setLoading(false);
          console.log(productsData)

            const combined = [
        ...productsData.map(item => ({ ...item, type: 'fashion', imgHeight: 60 + Math.random() * 80 })),
       
      ];



      const cols = [[], [], []];
      let columnHeights = [0, 0, 0];

      combined.forEach(item => {
        const shortest = columnHeights.indexOf(Math.min(...columnHeights));
        cols[shortest].push(item);
        columnHeights[shortest] += item.imgHeight;
      });

      setColumns(cols);
          const categoriesResponse = await fetch(`${baseURL}foodcat`);
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);





          
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };

      fetchData();

    
    }, [])
  );

  const searchProducts = () => {
    const nameText = input.name.toLowerCase();
    const regionText = input.region.toLowerCase();
  
    // Filter products based on the search criteria
    const filteredProducts = products
      .filter((item) => {
        const name = item.name ? item.name.toLowerCase() : "";
        const description = item.description ? item.description.toLowerCase() : "";
        const region = item.region ? item.region.toLowerCase() : "";
        const town = item.town ? item.town.toLowerCase() : "";
        const location = item.location ? item.location.toLowerCase() : "";
  
        // Check if the product name or description includes the name search text
        const matchesName = name.includes(nameText) || description.includes(nameText);
        // Check if any of the region, town, or location includes the region search text
        const matchesRegionOrLocation =
          region.includes(regionText) ||
          town.includes(regionText) ||
          location.includes(regionText);
  
        if (nameText && regionText) {
          return matchesName && matchesRegionOrLocation;
        } else if (nameText) {
          return matchesName;
        } else if (regionText) {
          return matchesRegionOrLocation;
        } else {
          return true; // If neither input is provided, return all products
        }
      })
      .map((item) => {
        // If regionText is provided, add region, town, or location to the product name
        if (regionText) {
          let regionDetail = "";
          if (item.region.toLowerCase().includes(regionText)) {
            regionDetail = item.region;
          } else if (item.town.toLowerCase().includes(regionText)) {
            regionDetail = item.town;
          } else if (item.location.toLowerCase().includes(regionText)) {
            regionDetail = item.location;
          }
  
          // Add the region detail to the product name if it exists
          if (regionDetail) {
            return {
              ...item,
              name: `${item.name} (${regionDetail})`
            };
          }
        }
  
        return item;
      });
  
    setProductsFiltered(filteredProducts);
  };
  
  
  
  

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  const changeCtg = (ctg) => {
    if (ctg === "all") {
      setProductCtg(initialState);
      setActive(true);
    } else {
      setProductCtg(
        products.filter(
          (item) => item.category && item.category?._id === ctg
        )
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }

    return format(date, "MMMM dd");
  };


  const handleCategoryPress = (categoryId) => {
    console.log('Category pressed:', categoryId);
  };


 



useEffect(() => {
  if (productCtg.length > 0) {
    const combined = productCtg.map(item => ({
      ...item,
      type: 'fashion',
      imgHeight: 60 + Math.random() * 80
    }));

    const cols = [[], [], []];
    let columnHeights = [0, 0, 0];

    combined.forEach(item => {
      const shortest = columnHeights.indexOf(Math.min(...columnHeights));
      cols[shortest].push(item);
      columnHeights[shortest] += item.imgHeight;
    });

    setColumns(cols);
  } else {
    setColumns([[], [], []]); // if no products in category
  }
}, [productCtg]);


const loadMoreProducts = () => {
    const nextPage = page + 1;
    const start = (nextPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;

    if (start < allProducts.length) {
      setDisplayedProducts(allProducts.slice(0, end));
      setPage(nextPage);
    }
  };

 const isOpenNow = (openingTimeStr, closingTimeStr) => {
  if (!openingTimeStr || !closingTimeStr) return false;

  const now = new Date();

  // Normalize time strings (remove whitespace and invisible chars)
  const cleanTime = (t) => t.replace(/[^\x20-\x7E]/g, '').trim();

  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const time = cleanTime(timeStr);

    // Handle 12-hour format (with AM/PM)
    const ampmMatch = time.match(/(\d{1,2}):?(\d{0,2})?\s*(AM|PM|am|pm)?/);
    if (!ampmMatch) return null;

    let [_, hour, minute, ampm] = ampmMatch;
    hour = parseInt(hour);
    minute = minute ? parseInt(minute) : 0;

    if (ampm) {
      if (ampm.toLowerCase() === 'pm' && hour < 12) hour += 12;
      if (ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
    }

    const parsed = new Date();
    parsed.setHours(hour, minute, 0, 0);
    return parsed;
  };

  const openingTime = parseTime(openingTimeStr);
  const closingTime = parseTime(closingTimeStr);

  if (!openingTime || !closingTime) return false;

  // Handle restaurants that close after midnight
  if (closingTime < openingTime) {
    if (now >= openingTime || now <= closingTime) {
      return true;
    }
  }

  return now >= openingTime && now <= closingTime;
};



 const renderItem = (item) => (
    <Pressable
      key={item._id}
       onPress={
        async () => {
          setPressLoading(true);
          try {
            // Send a GET request to fetch product details and increment view count
            const response = await fetch(`${baseURL}food/products/${item._id}`);
            const productData = await response.json();
            // Navigate to the detail page with the updated product data
            navigation.navigate("RestDetail", productData);

          
          } catch (error) {
            console.error("Error viewing product:", error);
          } finally {
            setPressLoading(false); // Hide loading indicator
          }
        }}
       style={{
    width: COLUMN_WIDTH,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: ITEM_MARGIN,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5, 
  }}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: item.picture }}
          style={{
            width: '100%',
            height: height/10
          }}
          resizeMode="cover"
          alt="poor connection"
        />
     
          <View style={{
            position: 'absolute',
            right: 1,
            backgroundColor: "black",
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 6,
          }}>
             <Text style={{ fontWeight: 'bold', fontSize: 8,  color: isOpenNow(item.openingTime, item.closingTime) ? '#f5a53d' : 'red' }}>
                {isOpenNow(item.openingTime, item.closingTime) ? 'Open Now' : 'Closed'}
              </Text> 
          </View>
        
      </View>

      <View style={{ padding: 8 }}>
        <Text numberOfLines={1} style={{ fontWeight: "bold", fontSize: 12 }}>
          {item.name}
        </Text>

        <Text style={{ fontSize: 12, color: "#f5a53d", fontWeight: "bold" }}>
          {!item?.price ? "Call for price" : (
            item?.discount ? (
              <>
                <Text style={{ textDecorationLine: 'line-through', color: 'gray' }}>
                  Gh₵{item.price}
                </Text>{" "}
                Gh₵{(item.price - (item.price * item.discount / 100)).toFixed(2)}
              </>
            ) : `Gh₵${item.price}`
          )}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Entypo name="location" size={9} color="#f5a53d" />
          <Text style={{ fontSize: 10, fontWeight: 'bold', marginLeft: 4 }}>{item.region}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <Entypo name="location-pin" size={9} color="#f5a53d" />
          <Text style={{ fontSize: 10, fontWeight: 'bold', marginLeft: 4 }}>{item.town}</Text>
        </View>
      </View>
    </Pressable>
  );
 
  

  return (
    <View >
      {loading ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator
            style={{ marginTop: "100%" }}
            size="large"
            color="#f5a53d"
          />
        </View>
      ) : (
        <View>
         
         <HStack
            style={{ backgroundColor: "#f1eeee", height: 110, justifyContent:"space-between"}}
            alignItems="center"
            w="full"
            px={6}
            safeAreaTop
          >
            {/* <TouchableOpacity onPress={() => navigation.navigate("give")}>
              <Image
                style={{ width: 38, left: -10, height: 38, bottom: 16 }}
                rounded={40}
                source={require("../assets/logo.png")}
                alt=""
              />
            </TouchableOpacity> */}

            <View style={{bottom:12}}>

        <View style={{bottom:20}} >
        {showSearchbut && ( 
     <Pressable  onPress={() => {
             setShowSearch(!showSearch);
             setShowSearchbut(false);
           }}
           style={{flexDirection:"row"}}>
             <Text style={{right:14}}>All the products you are looking for are available. </Text>
             <AntDesign style={{ right:26, top:10}} name="search1" size={28} color="black" />
           </Pressable>
        )}
      </View>

      {showSearch && (
        <>
        <View
          style={{
            borderRadius: 40,
            backgroundColor: "#f2f2f2",
            flexDirection: "row",
            width: "86%",
            justifyContent: "space-between",
            marginTop: -30,
            left:8,
            top:40
          }}
        >
      
      <View
      style={{
        borderRadius: 40,
        backgroundColor: "#f2f2f2",
        flexDirection: "row",
        width:width/1.2,
        justifyContent: "space-between",
        marginTop: -30,
        right: 16,
        ...(focus ? { top: 10 } : {bottom:4}),
      }}
    >
      <TextInput
        onFocus={openList}
        onChangeText={(text) => setInput({ ...input, name: text })}
        value={input.name}
        placeholder="Search by Name"
        style={{
          width: "50%",
          height: 40,
          borderWidth: 0,
          paddingLeft: 10,
          backgroundColor: "white",
          borderRadius: 20,
          marginRight: 8,
        }}
      />
      <TextInput
        onFocus={openList}
        onChangeText={(text) => setInput({ ...input, region: text })}
        value={input.region}
        placeholder="by region, town, or location"
        style={{
          width: "60%",
          height: 40,
          borderWidth: 0,
          paddingLeft: 10,
          backgroundColor: "#d3d0d0",
          borderRadius: 20,
        }}
      />
      {/* {focus && (
        <AntDesign
          name="closecircleo"
          size={24}
          onPress={() => {
            setInput({ name: "", region: "" });
            setShowSearch(false);
            setFocus(false);
          }}
          color="black"
          style={{ top: 8, right: 30 }}
        />
      )} */}
    </View>
         
        </View>
        {focus == true ? (
<View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, top:44 }}>
<TouchableOpacity
  style={{ backgroundColor: "black", padding: 7, borderRadius: 20 }}
  onPress={() => searchProducts("name")}
>
  <Text style={{ color: "white" }}>Search</Text>
</TouchableOpacity>

{/* Add a Clear button */}
<TouchableOpacity
  style={{ backgroundColor: "black", padding: 7, borderRadius: 20, right:20 }}
  onPress={() => {
    setInput({ name: "", region: "" }); 
    setProductsFiltered(products);
  }}
>
  <Text style={{ color: "white" }}>Clear Inputs</Text>
</TouchableOpacity>

<TouchableOpacity
  style={{ backgroundColor: "black", padding: 7, borderRadius: 20, right:20 }}
  onPress={() => {
    setInput({ name: "", region: "" });
    setShowSearch(false);
    setFocus(false);
    setShowSearchbut(true);
  }}
>
  <Text style={{ color: "white" }}>Hide</Text>
</TouchableOpacity>
</View>
        ):null}



</>
      )}
    </View>
          </HStack>
          {focus == true ? (
            <SearchProducts productFiltered={productFiltered} />
          ) : (
            <View style={{backgroundColor:"#f1eeee"}}>
        
            {/* Render Categories component */}
            <Categories
            
            categoryFilter={changeCtg}
            productCtg={productCtg}
            categories={categories}  />
       
              {productCtg.length > 0 ? (
              
               <>  

      <ScrollView 
      contentContainerStyle={{ 
   
    paddingBottom: height/1.5, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor:"#f1eeee",
    marginHorizontal:6
}}>
           {columns.map((col, index) => (
             <View key={index} style={{ width: COLUMN_WIDTH, paddingBottom: ITEM_MARGIN }}>
               {col.map(item => renderItem(item))}
             </View>
           ))}
         </ScrollView>
                 
              </>
              ) : (
                <View contentContainerStyle={{ 
  padding: ITEM_MARGIN, 
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  backgroundColor:"white" 
}}>
                  <Text style={{ color: "black" }}>
                    There are no products available.
                  </Text>
                </View>
              )}
             
            </View>
          )}

        {pressLoading && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}

        </View>
      )}
    </View>
  );
};

export default Restaurant;
const styles = StyleSheet.create({
 
  image:{height:height/9.5, width:width, borderRadius:12}

})