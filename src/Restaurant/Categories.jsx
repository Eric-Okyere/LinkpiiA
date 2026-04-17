import { View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { ScrollView, Text } from 'native-base';


const Categories = ({ categories, categoryFilter }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);


    const handleCategoryPress = (categoryId) => {
        setSelectedCategory(categoryId);
        categoryFilter(categoryId);
    };

    return (
        <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{ height: 66, marginRight: -20, marginBottom: 4, bottom:22, backgroundColor:"white", }}
        >
            <View style={{ flexDirection: "row", marginRight: 50 }}>
                <TouchableOpacity
                    key={1}
                    onPress={() => handleCategoryPress('all')}
                    style={{
                        backgroundColor: selectedCategory === 'all' ? "#f5a53d" : "black",
                        width: 38,
                        height: 38,
                        left: 14,
                        top: 6,
                        borderRadius: 46,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Text style={{
                        fontFamily: "rebotofont",
                        color: selectedCategory === 'all' ? "white" : "#f5a53d"
                    }}>
                        All
                    </Text>
                </TouchableOpacity>

                {categories.map((item) => {
                    const isSelected = selectedCategory === item._id;
                    return (
                        <View key={item._id}>
                            <TouchableOpacity
                                onPress={() => handleCategoryPress(item._id)}
                                style={{ height: 120, left: 30, top: -5 }}
                            >
                                <View style={{
                                    flexDirection: "row",
                                    marginRight: 8,
                                    top: 10,
                                    borderColor: "#f5a53d",
                                    borderWidth: 1,
                                    borderRadius: 26,
                                    paddingHorizontal: 6,
                                    paddingVertical: 2,
                                    backgroundColor: isSelected ? "#f5a53d" : "transparent"
                                }}>
                                    <Image
                                        source={{ uri: item.picture }}
                                        style={{ width: 34, top: 1, borderRadius: 30, height: 34 }}
                                        alt="poor network"
                                    />
                                    <Text style={{
                                        top: 6,
                                        fontSize: 14,
                                        marginLeft: 5,
                                        fontFamily: "rebotofont",
                                        color: isSelected ? "white" : "black"
                                    }}>
                                        {item.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
};

export default Categories;