import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Text, 
  StyleSheet 
} from 'react-native';
import theme from '../Styles/designSystem';

const ShopCats = ({ categories, categoryFilter }) => {
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
                                    source={{ uri: item.picture }}
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
        marginBottom: 16,
        marginTop: 1, // Matching your previous 'bottom: 16' logic
    },
    scrollContent: {
        paddingLeft: 12,
        paddingRight: 50,
        alignItems: 'center',
    },
    allButton: {
        backgroundColor: theme.colors.ink900,
        width: 44,
        height: 44,
        borderRadius: theme.radius.pill,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    selectedAll: {
        backgroundColor: theme.colors.brand600,
    },
    allText: {
        color: theme.colors.surface,
        fontSize: 14,
        fontWeight: 'bold',
    },
    catButton: {
        height: 40,
        marginRight: 10,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.pill,
        paddingHorizontal: 4,
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,
    },
    selectedCat: {
        backgroundColor: theme.colors.brand100,
        borderColor: theme.colors.brand600,
        borderWidth: 1.5,
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
        color: theme.colors.ink700,
    },
});

export default ShopCats;