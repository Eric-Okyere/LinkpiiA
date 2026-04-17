import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const ShopList = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleNavigateDetail = () => {
    props.navigation.navigate('shopdet', { ...props });
  };

  return (
    <View style={styles.rowWrapper}>
      {/* --- Action Modal --- */}
      <Modal animationType='fade' transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Shop Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity 
                style={styles.actionBox} 
                onPress={() => { props.navigation.navigate("shoppost", { item: props }); setModalVisible(false); }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#e8f0fe' }]}>
                  <MaterialCommunityIcons name="store-edit" size={28} color="#1a73e8" />
                </View>
                <Text style={styles.actionLabel}>Edit Shop</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionBox} 
                onPress={() => { props.delete(props._id); setModalVisible(false); }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#fce8e6' }]}>
                  <AntDesign name="delete" size={26} color="#d93025" />
                </View>
                <Text style={[styles.actionLabel, { color: '#d93025' }]}>Close Shop</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* --- Main Row Card --- */}
      <TouchableOpacity
        onPress={handleNavigateDetail}
        onLongPress={() => setModalVisible(true)}
        style={styles.card}
      >
        <View style={[styles.cell, { width: width * 0.25, flexDirection: 'row' }]}>
          <Image style={styles.img} source={{ uri: props.picture }} />
          <Image style={[styles.img, styles.stackedImg]} source={{ uri: props.picturesec }} />
        </View>

        <View style={[styles.cell, { width: width * 0.25 }]}>
          <Text style={styles.nameText} numberOfLines={1}>{props.name}</Text>
          <Text style={styles.townText}>{props.town || 'No Town'}</Text>
        </View>

        <View style={[styles.cell, { width: width * 0.2 }]}>
          <Text style={styles.regionText}>{props.region}</Text>
        </View>

        <View style={[styles.cell, { width: width * 0.15 }]}>
          <View style={[styles.statusDot, { backgroundColor: props.approved ? '#2e7d32' : '#ed6c02' }]} />
          <Text style={styles.statusText}>{props.approved ? 'Live' : 'Wait'}</Text>
        </View>

        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={styles.viewCount}>{props.views || 0}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginLeft: 10 }}>
            <Feather name="more-vertical" size={16} color="#ccc" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ShopList;

const styles = StyleSheet.create({
  rowWrapper: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  card: { flexDirection: "row", alignItems: 'center', padding: 12 },
  cell: { justifyContent: 'center' },
  img: { height: 42, width: 42, borderRadius: 10, backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#eee' },
  stackedImg: { marginLeft: -18, marginTop: 10, borderWidth: 2, borderColor: '#fff' },
  nameText: { fontSize: 13, fontWeight: '700', color: '#333' },
  townText: { fontSize: 10, color: '#999', marginTop: 2 },
  regionText: { fontSize: 12, color: '#666' },
  viewCount: { fontSize: 12, fontWeight: 'bold', color: '#444' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 5, marginBottom: 2 },
  statusText: { fontSize: 10, fontWeight: '800', color: '#555', textTransform: 'uppercase' },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: width * 0.8, backgroundColor: 'white', borderRadius: 25, padding: 25, elevation: 20 },
  modalHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 25, textAlign: 'center', color: '#333' },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  actionBox: { alignItems: 'center' },
  iconContainer: { width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  actionLabel: { fontSize: 13, fontWeight: 'bold', color: '#444' }
});