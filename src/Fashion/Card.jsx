import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Dimensions 
} from "react-native";
import baseURL from "../../assets/common/BaseUrl";
import LikeButton from "../components/Drawer/LikeButton";

const Card = ({
  item,
  navigation,
  setPressLoading,
  likedProducts,
  setLikedProducts,
  setCelebrate
}) => {

  const price = item.price || item.product?.price;
  const discount = item.discount || item.product?.discount;

  const openProduct = async () => {
    try {
      setPressLoading(true);
      const response = await fetch(
        `${baseURL}fashionpost/products/${item._id}`
      );
      const productData = await response.json();
      navigation.navigate("Detailpage", productData);
    } catch (error) {
      console.error("Error viewing product:", error);
    } finally {
      setPressLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={openProduct}
      activeOpacity={0.9}
      style={styles.cardContainer}
    >
      {/* IMAGE SECTION */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.picture }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* DISCOUNT BADGE */}
        {item?.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {item.discount}%
            </Text>
          </View>
        )}

        {/* LIKE BUTTON POSITIONING */}
        <View style={styles.likeButtonWrapper}>
          <LikeButton
            itemId={item._id}
            liked={!!likedProducts[item._id]}
            onToggle={(isLiked) => {
              setLikedProducts(prev => ({
                ...prev,
                [item._id]: isLiked
              }));
              if (isLiked) setCelebrate(true);
            }}
          />
        </View>
      </View>

      {/* NAME */}
      <Text numberOfLines={1} style={styles.productName}>
        {item.name}
      </Text>

      {/* PRICE LOGIC */}
      <View style={{ marginTop: 2 }}>
        {!price ? (
          <Text style={styles.callForPrice}>
            Call for price
          </Text>
        ) : discount ? (
          <View style={styles.priceRow}>
            <Text style={styles.originalPrice}>
              ₵{price}
            </Text>
            <Text style={styles.discountedPrice}>
              Gh₵{(price - price * (discount / 100)).toFixed(2)}
            </Text>
          </View>
        ) : (
          <Text style={styles.discountedPrice}>
            Gh₵{price}
          </Text>
        )}
      </View>

      {/* LOCATION */}
      <View style={styles.locationWrapper}>
        <Text numberOfLines={1} style={styles.locationText}>
          {item.region?.trim()}, {item.town?.trim()}, {item.location?.trim()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 6,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 8,
    // Native shadow for Android
    elevation: 4,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageWrapper: { 
    position: "relative" 
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8
  },
  discountBadge: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "black",
    paddingHorizontal: 6,
    borderRadius: 5
  },
  discountText: {
    color: "#f5a53d",
    fontSize: 10,
    fontWeight: "bold"
  },
  likeButtonWrapper: {
    position: "absolute",
    top: 6,
    right: 6
  },
  productName: {
    fontWeight: "bold",
    fontSize: 13,
    marginTop: 6,
    color: "#333"
  },
  callForPrice: { 
    fontSize: 12, 
    color: "#f5a53d", 
    fontWeight: "bold" 
  },
  priceRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "gray",
    fontSize: 10,
    marginRight: 6
  },
  discountedPrice: {
    fontSize: 12,
    color: "#f5a53d",
    fontWeight: "bold"
  },
  locationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3
  },
  locationText: { 
    fontSize: 9, 
    color: "#555" 
  }
});

export default Card;