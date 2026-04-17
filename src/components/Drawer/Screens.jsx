import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Feed from './Feed';
import UserPost from "../../../Admin/UserPost";
import PickerAndroid from "../../../Products/PickerAndriod";
import Terms from './Terms';
import Privacy from './Privacy';
import ManageServices from '../../Fashion/ManageServices';
import Post from '../../Fashion/Post';
import ShopPost from '../../Fashion/ShopPost';
import SellScreen from '../../../Products/SellScreen';
import PostRest from '../../Restaurant/PostRest';
import BuildingPost from '../../Hire/BuildingPost';
import Rentcarpost from '../../Hire/Rentcarpost';
import Equipmentpost from '../../Hire/EquipmentPost';
import Postform from "../../MyDriver/PostForm";
import Profile from '../../MyUsers/Profile';
import Sparepost from '../../SpareParts/Sparepost';
import Mechanics from '../../Mechanics/Mechanics';
import PostOkada from '../../Okada/PostOkada';
import ServicesPost from '../../Fashion/ServicesPost';
// … import the rest

export default function Screens({ screen }) {
  switch(screen) {
    case "Home": return <UserPost />;
    case "library": return <PickerAndroid />;
    case "terms": return <Terms />;
    case "privacy": return <Privacy />;
    case "servmana": return <ManageServices />;
    case "electronics": return <Post />;
    case "shoppost": return <ShopPost />;
    case "sellscreen": return <SellScreen />;
    case "restpost": return <PostRest />;
    case "postbuilding": return <BuildingPost />;
    case "scann": return <Rentcarpost />;
    case "equipost": return <Equipmentpost />;
    case "Postform": return <Postform />;
    case "profile": return <Profile />;
    case "sparepost": return <Sparepost />;
    case "mechanics": return <Mechanics />;
    case "okada": return <PostOkada />;
    case "servpost": return <ServicesPost />;
    // add all remaining screens in a similar fashion
    default: return (
      <View style={styles.screen}>
        <Text>Screen "{screen}" not found</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 40,
  },
});