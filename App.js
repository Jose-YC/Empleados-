import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import EmpleadosScreen from './src/screens/EmpleadosScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <EmpleadosScreen />
    </SafeAreaView>
  );
}