/**
 * Quản lý học tập - React Native Application
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StudyProvider } from './src/context/StudyContext';
import { StudyNavigator } from './src/navigation/StudyNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <StudyProvider>
        <NavigationContainer>
          <StudyNavigator />
        </NavigationContainer>
      </StudyProvider>
    </SafeAreaProvider>
  );
}

export default App;
