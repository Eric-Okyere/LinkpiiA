import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";

const BuildingCategories = ({ categories, categoryFilter }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategoryPress = (id) => {
    setSelectedCategory(id);
    categoryFilter(id);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => handleCategoryPress("all")}
          style={[
            styles.btn,
            selectedCategory === "all" && styles.active,
          ]}
        >
          <Text
            style={[
              styles.text,
              selectedCategory === "all" && styles.activeText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {categories.map((item) => {
          const active = selectedCategory === item._id;
          return (
            <TouchableOpacity
              key={item._id}
              onPress={() => handleCategoryPress(item._id)}
              style={[styles.btn, active && styles.active]}
            >
              <Image source={{ uri: item.picture }} style={styles.img} />
              <Text
                numberOfLines={1}
                style={[styles.text, active && styles.activeText]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default BuildingCategories;

const styles = StyleSheet.create({
  container: { paddingVertical: 10 },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },

  active: {
    backgroundColor: "black",
  },

  img: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 6,
  },

  text: {
    fontSize: 13,
    color: "#333",
  },

  activeText: {
    color: "#f5a53d",
    fontWeight: "bold",
  },
});