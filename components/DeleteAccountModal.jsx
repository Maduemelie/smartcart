import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';

export default function DeleteAccountModal({ visible, onClose, onConfirm }) {
  const { colors } = useColorScheme();
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onConfirm(password);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalText, { color: colors.text.primary }]}>
            Confirm Account Deletion
          </Text>
          <Text style={[styles.modalSubText, { color: colors.text.secondary }]}>
            For your security, please enter your password to confirm the deletion of your account.
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text.primary,
                borderColor: colors.border,
              },
            ]}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.text.secondary}
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonClose, { backgroundColor: colors.background }]}
              onPress={onClose}
            >
              <Text style={[styles.textStyle, { color: colors.text.primary }]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: '#FF3B30' }]}
              onPress={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textStyle}>Delete</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSubText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonClose: {
    borderWidth: 1,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
