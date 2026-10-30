import React from "react";
import { Pressable, View, Text, Image, StyleSheet } from "react-native";
import baseURL from "../../assets/common/BaseUrl";
import LikeButton from "../components/Drawer/LikeButton";
import useSaveToggle from "../hooks/useSaveToggle";
import theme from "../Styles/designSystem";

/**
 * Shop listing card, extracted out of ShopsScreen.jsx's inline renderItem
 * so each card is its own component instance - needed for useSaveToggle
 * (a hook) to be called once per shop rather than once per screen, which
 * is what the previous inline-function version would have required.
 * Mirrors Fashion/Card.jsx's layout, minus the discount/condition badges
 * shops don't have.
 */
const ShopCard = ({ item, navigation, setPressLoading, setCelebrate }) => {
  const { liked, toggle } = useSaveToggle("shops", item._id);

  const openShop = async () => {
    try {
      setPressLoading(true);
      const response = await fetch(`${baseURL}shops/products/${item._id}`);
      const productData = await response.json();
      navigation.navigate("Single", productData);
    } catch (error) {
      console.error("Error viewing product:", error);
    } finally {
      setPressLoading(false);
    }
  };

  return (
    <Pressable onPress={openShop} style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.picture }} style={styles.productImage} resizeMode="cover" />

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

      <Text numberOfLines={1} style={styles.shopName}>
        {item.name}
      </Text>

      <Text numberOfLines={1} style={styles.shopDescription}>
        {item.description}
      </Text>

      <View style={styles.locationWrapper}>
        <Text numberOfLines={1} style={styles.locationText}>
          {item.region?.trim()}, {item.town?.trim()}, {item.location?.trim()}
        </Text>
      </View>
    </Pressable>
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
    position: "relative",
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: theme.radius.sm,
  },
  likeButtonWrapper: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  shopName: {
    fontWeight: "bold",
    fontSize: 13,
    marginTop: 6,
    color: theme.colors.ink900,
  },
  shopDescription: {
    fontSize: 12,
    color: theme.colors.ink500,
    marginTop: 2,
  },
  locationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  locationText: {
    fontSize: 9,
    color: theme.colors.ink500,
  },
});

export default React.memo(ShopCard);
