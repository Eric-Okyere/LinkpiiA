import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Dimensions,
  ScrollView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import call from 'react-native-phone-call';

const { width } = Dimensions.get('window');

const Help = () => {

  const openDial = () => {
    const args = {
      number: '+233247747624',
      prompt: false,
      skipCanOpen: true
    };
    call(args).catch(console.error);
  };

  const openWhatsapp = () => {
    Linking.openURL(`https://wa.me/233209317581`)
      .catch(() => {
        alert("Make sure WhatsApp is installed on your device");
      });
  };

  const SupportCard = ({ title, subtitle, icon, color, onPress, type }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
        {type === 'ion' ? (
          <Ionicons name={icon} size={28} color={color} />
        ) : (
          <FontAwesome5 name={icon} size={24} color={color} />
        )}
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollBody}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Support Center</Text>
          <Text style={styles.subTitle}>How can we help you today?</Text>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Direct Contact</Text>
          
          <SupportCard 
            title="Call Support" 
            subtitle="Speak directly with an agent" 
            icon="call" 
            color="#007AFF" 
            type="ion"
            onPress={openDial}
          />

          <SupportCard 
            title="WhatsApp" 
            subtitle="Chat with us for quick answers" 
            icon="whatsapp" 
            color="#25D366" 
            type="fa"
            onPress={openWhatsapp}
          />
        </View>

        {/* FAQ / Info Section */}
        <View style={styles.infoBox}>
          <View style={styles.infoIcon}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#f5a53d" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Support Hours</Text>
            <Text style={styles.infoText}>Monday – Friday: 8:00 AM - 6:00 PM</Text>
            <Text style={styles.infoText}>Weekends: 10:00 AM - 4:00 PM</Text>
          </View>
        </View>

        {/* Branding/Footer */}
        <View style={styles.footer}>
          <MaterialCommunityIcons name="shield-check" size={40} color="#eee" />
          <Text style={styles.footerText}>Our team typically responds within 1 hour during business hours.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
  },
  subTitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#f5a53d",
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
    marginLeft: 5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
  },
  infoIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    marginTop: 50,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#bbb',
    marginTop: 10,
    paddingHorizontal: 40,
    lineHeight: 18,
  }
});

export default Help;