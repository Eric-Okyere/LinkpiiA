import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';

const RentCarSearch = ({ productFiltered, navigation }) => {
    return (
        <ScrollView style={styles.container}>
            {productFiltered.length > 0 ? (
                productFiltered.map((item) => (
                    <Pressable 
                        key={item._id} 
                        style={styles.itemRow}
                        onPress={() => navigation.navigate("rentcardetail", item)}
                    >
                        <Image source={{ uri: item.picture }} style={styles.img} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.loc}>{item.town}, {item.region}</Text>
                        </View>
                    </Pressable>
                ))
            ) : (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No equipment matches your search.</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2
    },
    img: { width: 50, height: 50, borderRadius: 8 },
    info: { marginLeft: 15 },
    name: { fontWeight: 'bold', fontSize: 14 },
    loc: { fontSize: 12, color: '#888' },
    empty: { marginTop: 50, alignItems: 'center' },
    emptyText: { color: '#666' }
});

export default RentCarSearch;