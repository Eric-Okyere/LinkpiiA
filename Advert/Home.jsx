import * as React from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity, BackHandler } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Adverts from './Adverts';

// Tab screens
const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <Adverts />
  </View>
);

export default function Home() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Hotpage' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
  });

  // 🔥 Updated tab bar (NO icon, NO title)
  const renderTabBar = (props) => {
    return (
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              key={route.key}
              style={{
                flex: 1,
                alignItems: 'center',
                padding: 10,
              }}
              onPress={() => setIndex(i)}
            >
              {/* ✔ Removed icon */}
              {/* ✔ Removed title */}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  React.useEffect(() => {
    const onBackPress = () => {
      if (index > 0) {
        setIndex((prevIndex) => prevIndex - 1);
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [index]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
}
