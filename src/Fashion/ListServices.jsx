import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, Modal, BlurView } from 'react-native';
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const ListServices = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleNavigate = () => {
    props.navigation.navigate('servsig', { ...props });
  };

  return (
    <View style={styles.cardContainer}>
      <Modal animationType='slide' transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Manage Listing</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                props.navigation.navigate("servpost", { item: props });
              }}
            >
              <MaterialCommunityIcons name="pencil-outline" size={24} color="#333" />
              <Text style={styles.modalOptionText}>Edit Details</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalOption, styles.deleteOption]}
              onPress={() => {
                setModalVisible(false);
                props.delete(props._id);
              }}
            >
              <AntDesign name="delete" size={24} color="red" />
              <Text style={[styles.modalOptionText, {color: 'red'}]}>Delete Listing</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={handleNavigate}
        onLongPress={() => setModalVisible(true)}
        style={styles.card}
      >
        <Image style={styles.image} source={{ uri: props.picture }} />
        
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>{props.name}</Text>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text numberOfLines={1} style={styles.region}>{props.region},{props.town}, {props.location}</Text>
          </View>
          
          <View style={styles.statusRow}>
            <View style={[styles.badge, { backgroundColor: props.approved ? '#e6fffa' : '#fffaf0' }]}>
              <Text style={[styles.badgeText, { color: props.approved ? '#2c7a7b' : '#b7791f' }]}>
                {props.approved ? "Approved" : "Under Review"}
              </Text>
            </View>
            <View style={styles.viewCount}>
              <Ionicons name="eye-outline" size={14} color="#666" />
              <Text style={styles.viewText}>{props.views || 0}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.moreBtn} onPress={() => setModalVisible(true)}>
          <Entypo name="dots-three-vertical" size={20} color="#999" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: { marginBottom: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { height: 70, width: 70, borderRadius: 12, backgroundColor: '#f0f0f0' },
  details: { flex: 1, marginLeft: 15 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  region: { fontSize: 13, color: '#666', marginLeft: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginRight: 10 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  viewCount: { flexDirection: 'row', alignItems: 'center' },
  viewText: { fontSize: 12, color: '#666', marginLeft: 4 },
  moreBtn: { padding: 10 },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: { fontSize: 16, marginLeft: 15, fontWeight: '500' },
  closeBtn: { marginTop: 20, padding: 10, alignItems: 'center' },
  closeBtnText: { color: '#666', fontWeight: 'bold' }
});

export default ListServices;