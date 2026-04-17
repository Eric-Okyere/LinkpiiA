import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const ListSpareParts = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.rowWrapper}>
      <Modal animationType='fade' transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Manage Listing</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity 
                style={styles.actionBox} 
                onPress={() => { props.navigation.navigate("sparepost", { item: props }); setModalVisible(false); }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
                  <MaterialCommunityIcons name="pencil" size={26} color="#1976d2" />
                </View>
                <Text style={styles.actionLabel}>Edit Info</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionBox} 
                onPress={() => { props.delete(props._id); setModalVisible(false); }}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#ffebee' }]}>
                  <AntDesign name="delete" size={26} color="#d32f2f" />
                </View>
                <Text style={[styles.actionLabel, { color: '#d32f2f' }]}>Deactivate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <TouchableOpacity
        onPress={() => props.navigation.navigate('spareadmin', { ...props })}
        onLongPress={() => setModalVisible(true)}
        style={styles.card}
      >
        <View style={[styles.cell, { width: width * 0.25, flexDirection: 'row' }]}>
          <Image style={styles.img} source={{ uri: props.picture }} />
          <Image style={[styles.img, { marginLeft: -15, borderWidth: 2, borderColor: '#fff' }]} source={{ uri: props.picturesec }} />
        </View>

        <View style={[styles.cell, { width: width * 0.25 }]}>
          <Text style={styles.nameText} numberOfLines={1}>{props.name}</Text>
          <Text style={styles.regionText}>{props.region}</Text>
        </View>

        <View style={[styles.cell, { width: width * 0.2 }]}>
          <Text style={styles.priceText}>₵{props.price}</Text>
        </View>

        <View style={[styles.cell, { width: width * 0.2 }]}>
          {props.approved ? (
            <View style={[styles.badge, styles.badgeSuccess]}>
              <Text style={styles.badgeText}>Live</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgePending]}>
              <Text style={styles.badgeText}>Pending</Text>
            </View>
          )}
        </View>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.viewCount}>{props.views}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ListSpareParts;

const styles = StyleSheet.create({
  rowWrapper: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  card: { flexDirection: "row", alignItems: 'center', padding: 12 },
  cell: { justifyContent: 'center' },
  img: { height: 40, width: 40, borderRadius: 8, backgroundColor: '#eee' },
  nameText: { fontSize: 13, fontWeight: '700', color: '#333' },
  regionText: { fontSize: 10, color: '#999' },
  priceText: { fontSize: 13, fontWeight: 'bold', color: '#2e7d32' },
  viewCount: { fontSize: 12, fontWeight: '600', color: '#666' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  badgeSuccess: { backgroundColor: '#e8f5e9' },
  badgePending: { backgroundColor: '#fff3e0' },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#333', textTransform: 'uppercase' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: width * 0.85, backgroundColor: 'white', borderRadius: 20, padding: 25 },
  modalHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  actionBox: { alignItems: 'center' },
  iconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 12, fontWeight: 'bold', color: '#444' }
});