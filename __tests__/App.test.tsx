/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// Proper mock for react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const SafeAreaInsetsContext = React.createContext(inset);
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaConsumer: ({ children }: { children: (insets: any) => React.ReactNode }) => children(inset),
    useSafeAreaInsets: () => inset,
    SafeAreaInsetsContext,
  };
});

// Complete mock for react-native-screens
jest.mock('react-native-screens', () => {
  const View = require('react-native').View;
  return {
    Screen: View,
    ScreenContainer: View,
    NativeScreen: View,
    NativeScreenContainer: View,
    ScreenStack: View,
    ScreenStackItem: View,
    ScreenStackHeaderConfig: View,
    ScreenStackHeaderSubview: View,
    SearchBar: View,
    enableScreens: jest.fn(),
    screensEnabled: () => true,
    compatibilityFlags: {},
  };
});

test('renders app root correctly', async () => {
  let tree: any;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<App />);
  });
  expect(tree).toBeDefined();
});
