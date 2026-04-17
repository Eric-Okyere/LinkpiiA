import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const Rentcarlist = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.rowWrapper}>
      {/* --- Fleet Action Modal --- */}
      <Modal animationType='fade' transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Vehicle Management</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity 
                style={styles.actionBox} 
                onPress={() => { props.navigation.navigate("scann", { item: props }); setModalVisible(false); }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
                  <MaterialCommunityIcons name="car-edit" size={28} color="#1976d2" />
                </View>
                <Text style={styles.actionLabel}>Edit Specs</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionBox} 
                onPress={() => { props.delete(props._id); setModalVisible(false); }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#ffebee' }]}>
                  <AntDesign name="delete" size={26} color="#d32f2f" />
                </View>
                <Text style={[styles.actionLabel, { color: '#d32f2f' }]}>Remove Car</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* --- Vehicle Row --- */}
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Rentadmin', { ...props })}
        onLongPress={() => setModalVisible(true)}
        style={styles.card}
      >
        <View style={[styles.cell, { width: width * 0.25, flexDirection: 'row' }]}>
          <Image style={styles.img} source={{ uri: props.picture }} />
          <Image style={[styles.img, styles.stackedImg]} source={{ uri: props.picturesec }} />
        </View>

        <View style={[styles.cell, { width: width * 0.25 }]}>
          <Text style={styles.nameText} numberOfLines={1}>{props.name}</Text>
          <Text style={styles.townText}>{props.town || props.region}</Text>
        </View>

        <View style={[styles.cell, { width: width * 0.2 }]}>
          <Text style={styles.priceText}>₵{props.price}</Text>
          <Text style={styles.perDay}>/ day</Text>
        </View>

        <View style={[styles.cell, { width: width * 0.15 }]}>
          <View style={[styles.statusBadge, { backgroundColor: props.approved ? '#e8f5e9' : '#fff3e0' }]}>
            <Text style={[styles.statusText, { color: props.approved ? '#2e7d32' : '#ed6c02' }]}>
              {props.approved ? 'Live' : 'Wait'}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Text style={styles.viewCount}>{props.views || 0}</Text>
          <Feather name="chevron-right" size={14} color="#ccc" style={{ marginLeft: 5 }} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Rentcarlist;

const styles = StyleSheet.create({
  rowWrapper: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  card: { flexDirection: "row", alignItems: 'center', padding: 15 },
  cell: { justifyContent: 'center' },
  img: { height: 44, width: 44, borderRadius: 10, backgroundColor: '#f0f0f0' },
  stackedImg: { marginLeft: -20, marginTop: 12, borderWidth: 2, borderColor: '#fff' },
  nameText: { fontSize: 13, fontWeight: '700', color: '#2c3e50' },
  townText: { fontSize: 10, color: '#95a5a6', marginTop: 2 },
  priceText: { fontSize: 13, fontWeight: 'bold', color: '#2c3e50' },
  perDay: { fontSize: 9, color: '#999' },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start' },
  statusText: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  viewCount: { fontSize: 12, fontWeight: '600', color: '#7f8c8d' },
  
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: width * 0.8, backgroundColor: 'white', borderRadius: 25, padding: 25 },
  modalHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  actionBox: { alignItems: 'center' },
  iconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 13, fontWeight: '600', color: '#333' }
});