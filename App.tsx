/**
 * Quản lý sinh viên - React Native Application
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StudentProvider } from './src/context/StudentContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <StudentProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </StudentProvider>
    </SafeAreaProvider>
  );
}

export default App;
