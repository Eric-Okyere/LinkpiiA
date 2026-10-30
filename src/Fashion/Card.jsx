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
import useSaveToggle from "../hooks/useSaveToggle";
import theme from "../Styles/designSystem";

const Card = ({
  item,
  navigation,
  setPressLoading,
  setCelebrate
}) => {
  const { liked, toggle } = useSaveToggle("fashionpost", item._id);

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

        {/* CONDITION TAG (e.g. "new" / "used") */}
        {item?.condition && (
          <View style={styles.conditionBadge}>
            <Text style={styles.conditionText}>
              {item.condition}
            </Text>
          </View>
        )}

        {/* DISCOUNT BADGE */}
        {item?.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {item.discount}%
            </Text>
          </View>
        )}

        {/* LIKE BUTTON POSITIONING - persisted via useSaveToggle, same
            backend endpoint the website's heart icons use */}
        <View style={styles.likeButtonWrapper}>
          <LikeButton
            itemId={item._id}
            liked={liked}
            onToggle={(isLiked) => {
              toggle(() => navigation.navigate("login"));
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
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 8,
    ...theme.shadow.card,
  },
  imageWrapper: { 
    position: "relative" 
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: theme.radius.sm
  },
  conditionBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.sm
  },
  conditionText: {
    color: theme.colors.ink700,
    fontSize: 9,
    fontWeight: "700",
    textTransform: "capitalize"
  },
  discountBadge: {
    position: "absolute",
    bottom: 0,
    backgroundColor: theme.colors.ink900,
    paddingHorizontal: 6,
    borderRadius: theme.radius.sm
  },
  discountText: {
    color: theme.colors.brand500,
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
    color: theme.colors.ink900
  },
  callForPrice: { 
    fontSize: 12, 
    color: theme.colors.brand700, 
    fontWeight: "bold" 
  },
  priceRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: theme.colors.ink500,
    fontSize: 10,
    marginRight: 6
  },
  discountedPrice: {
    fontSize: 12,
    color: theme.colors.brand700,
    fontWeight: "bold"
  },
  locationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3
  },
  locationText: { 
    fontSize: 9, 
    color: theme.colors.ink500 
  }
});

export default React.memo(Card);