import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const categories = [
  { label: 'Food', icon: "cutlery" },
  { label: 'Transport', icon: "bus" },
  { label: 'Entertainment', icon: "futbol-o" },
  { label: 'Health', icon: "heartbeat" },
  { label: 'Housing', icon: "home" },
  { label: 'Travel', icon: "plane" },
  { label: 'Others', icon: "ellipsis-h" },
];

const CategoryPicker = ({ category, setCategory }: { category: string, setCategory: (category: string) => void }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSelectCategory = (item: { label: string }) => {
    setCategory(item.label);
    toggleModal();
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleModal} style={styles.input}>
        <Text style={{ color: category ? Colors.black : Colors.grey }}>
          {category ? category : 'Select a category'}
        </Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.categoryItem} onPress={() => handleSelectCategory(item)}>
                  <FontAwesome name={item.icon} size={24} color={Colors.black} style={styles.categoryIcon} />
                  <Text style={styles.categoryText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.grey,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.white,
    width: '100%', // S'assure que le picker prend toute la largeur disponible
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15, // Augmentation du padding pour plus d'espace
  },
  categoryIcon: {
    marginRight: 15,
  },
  categoryText: {
    fontSize: 18,
    color: Colors.black,
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.tintColor,
    fontSize: 16,
  },
});

export default CategoryPicker;
