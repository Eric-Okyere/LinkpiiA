import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Text, 
  StyleSheet 
} from 'react-native';

const Categories = ({ categories, categoryFilter }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const handleCategoryPress = (categoryId) => {
        if (selectedCategory === categoryId) {
            // Optional: toggle off if needed, otherwise keep selected
            // setSelectedCategory(null); 
        } else {
            setSelectedCategory(categoryId);
            categoryFilter(categoryId);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* "All" Category Button */}
                <TouchableOpacity
                    onPress={() => {
                        setSelectedCategory('all');
                        categoryFilter('all');
                    }}
                    style={[
                        styles.allButton,
                        selectedCategory === 'all' && styles.selectedAll
                    ]}
                >
                    <Text style={styles.allText}>All</Text>
                </TouchableOpacity>

                {/* Dynamic Categories */}
                {categories.map((item) => {
                    const isSelected = selectedCategory === item._id;
                    return (
                        <TouchableOpacity
                            key={item._id}
                            onPress={() => handleCategoryPress(item._id)}
                            style={[
                                styles.catButton,
                                isSelected && styles.selectedCat
                            ]}
                        >
                            <View style={styles.catInner}>
                                <Image
                                    source={{ uri: item.icon }}
                                    style={styles.catImage}
                                />
                                <Text style={styles.catName}>
                                    {item.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        // marginBottom: 16,
        marginTop: -10, // Matching your previous 'bottom: 16' logic
    },
    scrollContent: {
        paddingLeft: 12,
        paddingRight: 50,
        alignItems: 'center',
    },
    allButton: {
        backgroundColor: "black",
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    selectedAll: {
        borderWidth: 2,
        borderColor: '#f5a53d',
    },
    allText: {
        color: "white",
        fontSize: 14,
        fontWeight: 'bold',
    },
    catButton: {
        height: 40,
        marginRight: 10,
        borderColor: "#f5a53d",
        borderWidth: 1,
        borderRadius: 26,
        paddingHorizontal: 4,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    selectedCat: {
        backgroundColor: '#FFF7ED', // Light orange tint for selection
        borderWidth: 2,
    },
    catInner: {
        flexDirection: "row",
        alignItems: 'center',
    },
    catImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    catName: {
        fontSize: 14,
        marginLeft: 6,
        paddingRight: 6,
        color: '#333',
    },
});

export default Categories;