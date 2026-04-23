import React, { useState } from 'react';
import { 
  Dimensions, 
  Image, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Modal, 
  Pressable 
} from 'react-native';
import { 
  AntDesign, 
  Ionicons, 
  MaterialCommunityIcons, 
  Feather, 
  Entypo 
} from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const ListProducts = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Navigate to single view
  const handleNavigate = () => {
    props.navigation.navigate('fashionsig', { ...props });
  };

  // Navigate to edit view
  const handleEdit = () => {
    props.navigation.navigate("electronics", { item: props });
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* --- Action Modal --- */}
      <Modal 
        animationType='fade' 
        transparent={true} 
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalIndicator} />
            <Text style={styles.modalTitle}>Manage Listing</Text>
            
            <View style={styles.actionGrid}>
              <TouchableOpacity onPress={handleEdit} style={styles.actionItem}>
                <View style={[styles.iconBox, { backgroundColor: '#e3f2fd' }]}>
                  <MaterialCommunityIcons name="pencil" size={26} color="#1976d2" />
                </View>
                <Text style={styles.actionLabel}>Edit Info</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => {
                  props.delete(props._id);
                  setModalVisible(false);
                }}
                style={styles.actionItem}
              >
                <View style={[styles.iconBox, { backgroundColor: '#ffebee' }]}>
                  <AntDesign name="delete" size={26} color="#d32f2f" />
                </View>
                <Text style={[styles.actionLabel, { color: '#d32f2f' }]}>Remove</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={() => setModalVisible(false)} 
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* --- Product Card Row --- */}
      <TouchableOpacity
        onPress={handleNavigate}
        onLongPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        style={styles.card}
      >
        {/* Image Column */}
        <View style={[styles.cell, { width: width * 0.18 }]}>
          <Image 
            style={styles.image} 
            source={{ uri: props.picture || 'https://via.placeholder.com/150' }} 
          />
        </View>

        {/* Name Column */}
        <View style={[styles.cell, { width: width * 0.25 }]}>
          <Text style={styles.nameText} numberOfLines={1}>{props.name}</Text>
          <Text style={styles.regionText} numberOfLines={1}>{props.region || 'N/A'}</Text>
        </View>

        {/* Price Column */}
        <View style={[styles.cell, { width: width * 0.20 }]}>
          <Text style={styles.priceText} numberOfLines={1}>₵{props.price}</Text>
        </View>

        {/* Status Column */}
        <View style={[styles.cell, { width: width * 0.15 }]}>
          <View style={[
            styles.statusPill, 
            props.approved ? styles.liveBg : styles.waitBg
          ]}>
            <Text style={[
              styles.statusText, 
              props.approved ? styles.liveText : styles.waitText
            ]}>
              {props.approved ? 'Live' : 'Wait'}
            </Text>
          </View>
        </View>

        {/* More Actions Column */}
        <TouchableOpacity 
            onPress={() => setModalVisible(true)}
            style={styles.moreButton}
        >
            <Entypo name="dots-three-vertical" size={16} color="#ced4da" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    // Professional Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cell: {
    justifyContent: 'center',
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  nameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2d3436',
  },
  regionText: {
    fontSize: 11,
    color: '#b2bec3',
    marginTop: 2,
  },
  priceText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '800',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBg: { backgroundColor: '#e8f5e9' },
  waitBg: { backgroundColor: '#fff3e0' },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  liveText: { color: '#2e7d32' },
  waitText: { color: '#ef6c00' },
  moreButton: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 5,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end', // Slides up from bottom
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d3436',
    marginBottom: 30,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  actionItem: {
    alignItems: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
  },
  cancelButton: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    color: '#b2bec3',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default ListProducts;