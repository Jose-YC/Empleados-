import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert, TextInput } from 'react-native';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import EmpleadoForm from '../components/EmpleadoForm';
import { db } from '../services/firebaseConfig';

const EmpleadosScreen = () => {
  const [empleados, setEmpleados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'empleados'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const empleadosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmpleados(empleadosData);
    });

    return () => unsubscribe();
  }, []);

  const filtrarEmpleados = (texto) => {
    setBusqueda(texto);
  };

  const empleadosFiltrados = empleados.filter(empleado => 
    !busqueda || 
    empleado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    empleado.apellido.toLowerCase().includes(busqueda.toLowerCase())
  );

  const eliminarEmpleado = async (id) => {
    try {
      await deleteDoc(doc(db, 'empleados', id));
      Alert.alert('Éxito', 'Empleado eliminado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el empleado: ' + error.message);
    }
  };

  const confirmarEliminar = (id) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Está seguro de que desea eliminar este empleado?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        { 
          text: 'Eliminar', 
          onPress: () => eliminarEmpleado(id),
          style: 'destructive' 
        },
      ]
    );
  };

  const abrirFormularioEdicion = (empleado) => {
    setSelectedEmpleado(empleado);
    setModalVisible(true);
  };

  const renderEmpleado = ({ item }) => (
    <View style={styles.empleadoContainer}>
      <Text style={styles.empleadoTexto}>
        {item.nombre} {item.apellido}
      </Text>
      <Text>{item.email}</Text>
      <Text>{item.cargo}</Text>
      <Text>Salario: ${item.salario.toLocaleString()}</Text>
      <View style={styles.botonesContainer}>
        <TouchableOpacity 
          style={styles.botonEditar}
          onPress={() => abrirFormularioEdicion(item)}
        >
          <Text style={styles.botonTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.botonEliminar}
          onPress={() => confirmarEliminar(item.id)}
        >
          <Text style={styles.botonTexto}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
       <TextInput
        style={styles.barraBusqueda}
        placeholder="Buscar empleado por nombre o apellido"
        value={busqueda}
        onChangeText={filtrarEmpleados}
        clearButtonMode="always"
      />
      <TouchableOpacity 
        style={styles.botonAgregar}
        onPress={() => {
          setSelectedEmpleado(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.botonAgregarTexto}>+ Agregar Empleado</Text>
      </TouchableOpacity>

      <FlatList
        data={empleadosFiltrados}
        renderItem={renderEmpleado}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          busqueda ? (
            <Text style={styles.textoVacio}>
              No se encontraron empleados que coincidan con "{busqueda}"
            </Text>
          ) : (
            <Text style={styles.textoVacio}>No hay empleados registrados</Text>
          )
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <EmpleadoForm 
              empleado={selectedEmpleado}
              onClose={() => setModalVisible(false)}
              isEditing={!!selectedEmpleado}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  botonAgregar: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  botonAgregarTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  empleadoContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  empleadoTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botonEditar: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  botonEliminar: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  textoVacio: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});

export default EmpleadosScreen;