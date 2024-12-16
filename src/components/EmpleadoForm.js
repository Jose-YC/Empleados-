import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';


const EmpleadoForm = ({ empleado, onClose, isEditing }) => {
  const [nombre, setNombre] = useState(empleado?.nombre || '');
  const [apellido, setApellido] = useState(empleado?.apellido || '');
  const [email, setEmail] = useState(empleado?.email || '');
  const [cargo, setCargo] = useState(empleado?.cargo || '');
  const [salario, setSalario] = useState(empleado?.salario ? empleado.salario.toString() : '');

  const guardarEmpleado = async () => {
    // Validaciones básicas
    if (!nombre || !apellido || !email || !cargo || !salario) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const empleadoData = {
        nombre, apellido, email,cargo,
        salario: parseFloat(salario),
        fechaContratacion: new Date()
      };

      if (isEditing) {
        // Actualizar empleado existente
        await setDoc(doc(db, 'empleados', empleado.id), empleadoData);
        Alert.alert('Éxito', 'Empleado actualizado correctamente');
      } else {
        // Agregar nuevo empleado
        await addDoc(collection(db, 'empleados'), empleadoData);
        Alert.alert('Éxito', 'Empleado agregado correctamente');
      }

      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el empleado: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Cargo"
        value={cargo}
        onChangeText={setCargo}
      />
      <TextInput
        style={styles.input}
        placeholder="Salario"
        value={salario}
        onChangeText={setSalario}
        keyboardType="numeric"
      />
      <Button title={isEditing ? "Actualizar" : "Agregar"} onPress={guardarEmpleado} />
      <Button title="Cancelar" onPress={onClose} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default EmpleadoForm;
