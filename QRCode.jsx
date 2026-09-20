import React from 'react';
import { View, TouchableOpacity, Platform, Linking, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const openLink = () => {
  const iosLink = "https://apps.apple.com/gh/app/linkpii/id6502578883";
  const androidLink = "https://play.google.com/store/apps/details?id=com.ericok.palm";

  const link = Platform.OS === 'ios' ? iosLink : androidLink;
  Linking.openURL(link).catch(err => console.error("Failed to open URL:", err));
};

const QRCodeGenerator = () => {
  const iosLink = "https://apps.apple.com/gh/app/linkpii/id6502578883";
  const androidLink = "https://play.google.com/store/apps/details?id=com.ericok.palm";
  const value = Platform.OS === 'ios' ?  androidLink: iosLink ;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openLink}>
        <QRCode
          value={value}
          size={200}
          color="black"
          backgroundColor="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default QRCodeGenerator;
